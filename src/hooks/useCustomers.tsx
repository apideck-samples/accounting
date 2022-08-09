import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { Invoice } from '@apideck/node'
import { fetcher } from 'utils'
import { usePrevious } from '@apideck/components'

export const useCustomers = () => {
  const [cursor, setCursor] = useState(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.service_id || ''
  const prevServiceId = usePrevious(serviceId)
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

  const createCustomer = async (invoice: Invoice) => {
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

  return {
    customers: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error,
    hasNextPage: data?.meta?.cursors?.next,
    currentPage: data?.meta?.cursors?.current,
    nextPage,
    createCustomer
  }
}
