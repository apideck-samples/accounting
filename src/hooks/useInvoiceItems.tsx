import { CreateInvoiceItemResponse, InvoiceItem } from '@apideck/node'
import { useConnections, useSession } from 'hooks'
import useSWR, { useSWRConfig } from 'swr'

import { fetcher } from 'utils'

export const useInvoiceItems = () => {
  const { connection } = useConnections()
  const { session } = useSession()
  const { mutate } = useSWRConfig()
  const serviceId = connection?.service_id || ''

  const url = serviceId
    ? `/api/accounting/invoice-items/all?jwt=${session?.jwt}&serviceId=${serviceId}`
    : null

  const { data, error } = useSWR(url, fetcher)

  const createInvoiceItem = async (invoiceItem: InvoiceItem) => {
    const response = await fetch(
      `/api/accounting/invoice-items/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify(invoiceItem)
      }
    )
    const result: CreateInvoiceItemResponse = await response.json()
    if (result?.data) {
      mutate(url)
    }
    return result
  }

  return {
    invoiceItems: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error,
    createInvoiceItem
  }
}
