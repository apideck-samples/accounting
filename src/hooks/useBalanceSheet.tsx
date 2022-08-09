import { fetcher } from '../utils/fetcher'
import { useConnections } from './useConnections'
import useSWR from 'swr'
import { useSession } from './useSession'

export const useBalanceSheet = () => {
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.service_id || ''

  const getBalanceSheetUrl = serviceId
    ? `/api/accounting/balance-sheet?jwt=${session?.jwt}&serviceId=${serviceId}`
    : null

  const { data, error } = useSWR(getBalanceSheetUrl, fetcher)

  return {
    balanceSheet: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error
  }
}
