import type { Customer, CustomerInput } from '@apideck/unify/models/components'

import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { usePrevious } from '@apideck/components'
import { fetcher } from 'utils'

export const useCustomers = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getCustomersUrl = serviceId
    ? `/api/accounting/customers/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data: swrData, error: swrError } = useSWR(getCustomersUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const addCustomer = async (customerPayload: CustomerInput) => {
    try {
      const response = await fetch(
        `/api/accounting/customers/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
        { method: 'POST', body: JSON.stringify(customerPayload) }
      )
      const responseData = await response.json()
      if (!response.ok) {
        return { error: { ...responseData, statusCode: response.status } }
      }
      return responseData
    } catch (err: any) {
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' },
          statusCode: 500
        }
      }
    }
  }

  const removeCustomer = async (id: string) => {
    try {
      const response = await fetch(
        `/api/accounting/customers/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
        { method: 'POST', body: JSON.stringify({ id }) }
      )
      const responseData = await response.json().catch(() => ({}))
      if (!response.ok) {
        return { error: { ...responseData, statusCode: response.status } }
      }
      return { success: true, data: responseData }
    } catch (err: any) {
      return {
        error: {
          message: 'Network error while deleting customer',
          detail: { message: err.message || 'Could not connect to server' },
          statusCode: 500
        }
      }
    }
  }

  const createCustomer = async (customerPayload: CustomerInput) => {
    const responseData = await addCustomer(customerPayload)
    if (responseData && !responseData.error) {
      mutate(getCustomersUrl)
    }
    return responseData
  }

  const deleteCustomer = async (id: string) => {
    const responseData = await removeCustomer(id)
    if (responseData && responseData.success) {
      mutate(getCustomersUrl)
    }
    return responseData
  }

  // Robustly access nested data from SDK responses
  const responseData = swrData?.getCustomersResponse || swrData
  const customers = responseData?.data as Customer[] | undefined
  const meta = responseData?.meta

  const nextPage = () => {
    const nextCursor = meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = meta?.cursors?.previous
    if (prevCursor) {
      setCursor(prevCursor)
    }
  }

  const apiError = swrData?.error || swrError
  if (swrError) {
    swrError.statusCode = swrError.status || 500
  }

  const isLoading = !swrError && !swrData && !!getCustomersUrl

  return {
    customers,
    isLoading,
    error: apiError,
    hasNextPage: !!meta?.cursors?.next,
    hasPrevPage: !!meta?.cursors?.previous,
    currentPage: meta?.cursors?.current,
    nextPage,
    prevPage,
    createCustomer,
    deleteCustomer
  }
}
