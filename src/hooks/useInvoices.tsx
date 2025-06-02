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

  const { data, error } = useSWR(getInvoicesUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const addInvoice = async (invoice: Invoice) => {
    const response = await fetch(
      `/api/accounting/invoices/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify(invoice)
      }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to add invoice: ${response.statusText}`)
    }
    return response.json()
  }

  const removeInvoice = async (id: string) => {
    const response = await fetch(
      `/api/accounting/invoices/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify({ id })
      }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to delete invoice: ${response.statusText}`)
    }
    return response.json()
  }

  const createInvoice = async (invoice: Invoice) => {
    const response = await addInvoice(invoice)
    if (response) {
      mutate(getInvoicesUrl)
    }
    return response
  }

  const deleteInvoice = async (id: string) => {
    const response = await removeInvoice(id)
    mutate(getInvoicesUrl)
    return response
  }

  const nextPage = () => {
    const nextCursor = data?.getInvoicesResponse?.meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.getInvoicesResponse?.meta?.cursors?.previous
    setCursor(prevCursor)
  }

  const apiError = data?.getInvoicesResponse?.error
  const isLoadingState = !error && !data && !!getInvoicesUrl

  return {
    invoices: data?.getInvoicesResponse?.data as Invoice[] | undefined,
    isLoading: isLoadingState,
    error: apiError || error,
    hasNextPage: !!data?.getInvoicesResponse?.meta?.cursors?.next,
    currentPage: data?.getInvoicesResponse?.meta?.cursors?.current,
    hasPrevPage: !!data?.getInvoicesResponse?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createInvoice,
    deleteInvoice
  }
}
