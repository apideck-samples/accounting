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

  const { data, error: swrError } = useSWR(getCustomersUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const addCustomer = async (customerPayload: CustomerInput): Promise<Customer | any> => {
    const response = await fetch(
      `/api/accounting/customers/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify(customerPayload)
      }
    )
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Failed to add customer')
    }
    return result
  }

  const removeCustomer = async (id: string): Promise<any> => {
    const response = await fetch(
      `/api/accounting/customers/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify({ id })
      }
    )
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete customer')
    }
    return result
  }

  const createCustomer = async (customerPayload: CustomerInput): Promise<Customer | any> => {
    const response = await addCustomer(customerPayload)
    if (response?.id) {
      mutate(getCustomersUrl)
    }
    return response
  }

  const deleteCustomer = async (id: string): Promise<any> => {
    await removeCustomer(id)
    mutate(getCustomersUrl)
  }

  const nextPage = () => {
    const nextCursor = data?.meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.meta?.cursors?.previous
    if (prevCursor) {
      setCursor(prevCursor)
    }
  }

  const isLoading = !swrError && !data && !!getCustomersUrl
  const apiErrorMessage =
    data && (data as any).message && (data as any).error ? (data as any).message : undefined

  return {
    customers: data?.data as Customer[] | undefined,
    isLoading: isLoading,
    isError: swrError || apiErrorMessage || data?.error,
    hasNextPage: !!data?.meta?.cursors?.next,
    hasPrevPage: !!data?.meta?.cursors?.previous,
    currentPage: data?.meta?.cursors?.current,
    nextPage,
    prevPage,
    createCustomer,
    deleteCustomer
  }
}
