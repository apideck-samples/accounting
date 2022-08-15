import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { Invoice } from '@apideck/node'
import { fetcher } from 'utils'
import { usePrevious } from '@apideck/components'

export const useInvoices = () => {
  const [cursor, setCursor] = useState(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.service_id || ''
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
    return response.json()
  }

  const createInvoice = async (invoice: Invoice) => {
    const response = await await addInvoice(invoice)
    if (response?.data) {
      mutate(getInvoicesUrl)
    }
    return response
  }

  const deleteInvoice = async (id: string) => {
    const response = await await removeInvoice(id)
    if (response?.data) {
      mutate(getInvoicesUrl)
    }
    return response
  }

  const nextPage = () => {
    const nextCursor = data?.meta?.cursors?.next

    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.meta?.cursors?.previous
    setCursor(prevCursor)
  }

  return {
    invoices: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error,
    hasNextPage: data?.meta?.cursors?.next,
    currentPage: data?.meta?.cursors?.current,
    hasPrevPage: data?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createInvoice,
    deleteInvoice
  }
}
