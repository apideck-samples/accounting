import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { usePrevious } from '@apideck/components'
import { LedgerAccount } from '@apideck/unify/models/components'
import { fetcher } from 'utils'

export const useLedgerAccounts = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getLedgerAccountsUrl = serviceId
    ? `/api/accounting/ledger-accounts/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data: swrData, error: swrError } = useSWR(getLedgerAccountsUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  // Attempt to access data and meta robustly
  const responseData = swrData?.getLedgerAccountsResponse || swrData // Fallback to swrData if nested response not found
  const ledgerAccounts = responseData?.data as LedgerAccount[] | undefined
  const meta = responseData?.meta

  const nextPage = () => {
    const nextCursor = meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = meta?.cursors?.previous
    setCursor(prevCursor)
  }

  const apiError = responseData?.error || swrData?.error // Check both possible error locations
  const isLoadingState = !swrError && !swrData && !!getLedgerAccountsUrl

  return {
    ledgerAccounts,
    isLoading: isLoadingState,
    error: apiError || swrError,
    hasNextPage: !!meta?.cursors?.next,
    currentPage: meta?.cursors?.current,
    hasPrevPage: !!meta?.cursors?.previous,
    nextPage,
    prevPage
  }
}
