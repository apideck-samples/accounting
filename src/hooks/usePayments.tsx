import type { Payment } from '@apideck/unify/models/components'
import { useConnections, useSession } from 'hooks'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from 'utils'

export const usePayments = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''

  const hasNewCursor = !!cursor
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getPaymentsUrl = serviceId
    ? `/api/accounting/payments/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data, error: swrError } = useSWR(getPaymentsUrl, fetcher)

  const nextPage = () => {
    const nextCursor = data?.getPaymentsResponse?.meta?.cursors?.next

    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.getPaymentsResponse?.meta?.cursors?.previous
    if (prevCursor) {
      setCursor(prevCursor)
    }
  }

  const isLoading = !swrError && !data && !!getPaymentsUrl
  const responseData = data?.getPaymentsResponse
  const apiErrorMessage = data?.message

  return {
    payments: responseData?.data as Payment[] | undefined,
    isLoading: isLoading,
    isError: swrError || apiErrorMessage || responseData?.error,
    hasNextPage: !!responseData?.meta?.cursors?.next,
    hasPrevPage: !!responseData?.meta?.cursors?.previous,
    currentPage: responseData?.meta?.cursors?.current,
    nextPage,
    prevPage
  }
}
