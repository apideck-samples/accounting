import { useConnections, useSession } from 'hooks'

import { fetcher } from 'utils'
import useSWR from 'swr'

export const useInvoiceItems = () => {
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.service_id || ''

  console.log('serviceId', serviceId)

  const url = serviceId
    ? `/api/accounting/invoice-items/all?jwt=${session?.jwt}&serviceId=${serviceId}`
    : null

  const { data, error } = useSWR(url, fetcher)

  return {
    invoiceItems: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error
  }
}
