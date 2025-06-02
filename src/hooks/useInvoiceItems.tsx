import type { InvoiceItem } from '@apideck/unify/models/components'
import { useConnections, useSession } from 'hooks'
import useSWR, { useSWRConfig } from 'swr'
import { fetcher } from 'utils'

export const useInvoiceItems = () => {
  const { connection } = useConnections()
  const { session } = useSession()
  const { mutate } = useSWRConfig()
  const serviceId = connection?.serviceId || ''

  const getInvoiceItemsUrl = serviceId
    ? `/api/accounting/invoice-items/all?jwt=${session?.jwt}&serviceId=${serviceId}`
    : null

  const { data, error: swrError } = useSWR(getInvoiceItemsUrl, fetcher)

  const createInvoiceItem = async (
    invoiceItemPayload: Omit<InvoiceItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<InvoiceItem | any> => {
    const response = await fetch(
      `/api/accounting/invoice-items/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
      {
        method: 'POST',
        body: JSON.stringify(invoiceItemPayload)
      }
    )
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create invoice item')
    }

    if (result && result.id) {
      mutate(getInvoiceItemsUrl)
    }
    return result
  }

  console.log('data', data)

  const isLoading = !swrError && !data && !!getInvoiceItemsUrl
  const responseData = data?.getInvoiceItemsResponse
  const apiErrorMessage = data?.message

  return {
    invoiceItems: responseData?.data as InvoiceItem[] | undefined,
    isLoading: isLoading,
    isError: swrError || apiErrorMessage || responseData?.error,
    createInvoiceItem
  }
}
