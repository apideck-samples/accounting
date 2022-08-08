import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { Invoice } from '@apideck/node'
import { fetcher } from './fetcher'
import { useConnections } from './useConnections'
import { usePrevious } from '@apideck/components'
import { useSession } from './useSession'

export const useCustomers = () => {
  const [cursor, setCursor] = useState(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.service_id || ''
  const prevServiceId = usePrevious(serviceId)
  const prevCursor = usePrevious(cursor)
  const { mutate } = useSWRConfig()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getCustomersUrl = serviceId
    ? `/api/accounting/customers/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data, error } = useSWR(getCustomersUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const addCustomer = async (invoice: Invoice) => {
    const response = await fetch(
      `/api/accounting/customers/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify(invoice)
      }
    )
    return response.json()
  }

  const createInvoice = async (invoice: Invoice) => {
    const invoices = [...data, invoice]
    const options = { optimisticData: invoices, rollbackOnError: true }
    mutate(getCustomersUrl, addCustomer(invoice), options)
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

  useEffect(() => {
    if (prevCursor && prevCursor !== cursor) {
      // revalidate()
    }
  }, [cursor, prevCursor])

  return {
    customers: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error,
    hasNextPage: data?.meta?.cursors?.next,
    currentPage: data?.meta?.cursors?.current,
    hasPrevPage: data?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createInvoice
  }
}
