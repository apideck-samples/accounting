import type { BalanceSheet } from '@apideck/unify/models/components'
import useSWR from 'swr'
import { fetcher } from '../utils/fetcher'
import { useConnections } from './useConnections'
import { useSession } from './useSession'

export const useBalanceSheet = () => {
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''

  const getBalanceSheetUrl = serviceId
    ? `/api/accounting/balance-sheet?jwt=${session?.jwt}&serviceId=${serviceId}`
    : null

  const { data, error: swrError } = useSWR(getBalanceSheetUrl, fetcher)

  const isLoading = !swrError && !data && !!getBalanceSheetUrl
  const responseData = data?.getBalanceSheetResponse
  const apiErrorMessage = data?.message

  return {
    balanceSheet: responseData?.data as BalanceSheet | undefined,
    isLoading: isLoading,
    isError: swrError || apiErrorMessage || responseData?.error
  }
}
