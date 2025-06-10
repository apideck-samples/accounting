import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { usePrevious } from '@apideck/components'
import { Invoice } from '@apideck/unify/models/components'
import { fetcher } from 'utils'

export const useInvoices = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getInvoicesUrl = serviceId
    ? `/api/accounting/invoices/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data, error: swrError } = useSWR(getInvoicesUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    try {
      const response = await fetch(
        `/api/accounting/invoices/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
        { method: 'POST', body: JSON.stringify(invoice) }
      )
      const responseData = await response.json()
      if (!response.ok) {
        return { error: { ...responseData, statusCode: response.status } }
      }
      return responseData
    } catch (err: any) {
      console.error('Network or other error in addInvoice:', err)
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' },
          statusCode: 500
        }
      }
    }
  }

  const removeInvoice = async (id: string) => {
    try {
      const response = await fetch(
        `/api/accounting/invoices/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
        { method: 'POST', body: JSON.stringify({ id }) }
      )
      const responseData = await response.json().catch(() => ({}))
      if (!response.ok) {
        return { error: { ...responseData, statusCode: response.status } }
      }
      return { success: true, data: responseData }
    } catch (err: any) {
      console.error('Network or other error in removeInvoice:', err)
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' },
          statusCode: 500
        }
      }
    }
  }

  const createInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    const responseData = await addInvoice(invoice)
    if (responseData && !responseData.error && responseData.createInvoiceResponse?.data?.id) {
      mutate(getInvoicesUrl)
    }
    return responseData
  }

  const deleteInvoice = async (id: string) => {
    const responseData = await removeInvoice(id)
    if (responseData && responseData.success) {
      mutate(getInvoicesUrl)
    }
    return responseData
  }

  const nextPage = () => {
    const nextCursor = data?.getInvoicesResponse?.meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.getInvoicesResponse?.meta?.cursors?.previous
    if (prevCursor) {
      setCursor(prevCursor)
    }
  }

  const apiSpecificError = data?.getInvoicesResponse?.error
  const apiError = apiSpecificError || swrError
  if (swrError) {
    // The fetcher used by SWR may already structure the error, but we ensure statusCode is present
    swrError.statusCode = swrError.status || 500
  }
  const isLoadingState = !swrError && !data && !!getInvoicesUrl

  return {
    invoices: data?.getInvoicesResponse?.data as Invoice[] | undefined,
    isLoading: isLoadingState,
    error: apiError, // This error object will now reliably contain a statusCode
    hasNextPage: !!data?.getInvoicesResponse?.meta?.cursors?.next,
    currentPage: data?.getInvoicesResponse?.meta?.cursors?.current,
    hasPrevPage: !!data?.getInvoicesResponse?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createInvoice,
    deleteInvoice
  }
}
