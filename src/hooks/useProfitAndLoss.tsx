import { fetcher } from '../utils/fetcher'
import { useConnections } from './useConnections'
import useSWR from 'swr'
import { useSession } from './useSession'

export const useProfitAndLoss = () => {
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.service_id || ''

  const getProfitAndLossUrl = serviceId
    ? `/api/accounting/profit-and-loss?jwt=${session?.jwt}&serviceId=${serviceId}`
    : null

  const { data, error } = useSWR(getProfitAndLossUrl, fetcher)

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1)
  }

  const getLastNMonths = (n = 7) => {
    const date = new Date()
    const firstDayCurrentMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth())
    const currentMonth = date.getMonth()

    const result = []
    for (let i = n; i > 0; i--) {
      firstDayCurrentMonth.setMonth(currentMonth - i)

      result.push(firstDayCurrentMonth.toISOString().substring(0, 10))
    }
    return result
  }

  const multiFetcher = (...urls: string[]) => {
    return Promise.all(urls.map((url) => fetcher(url)))
  }

  const getUrls = () => {
    const months = getLastNMonths()
    return months
      .map(
        (month, i) =>
          months[i - 1] &&
          `${getProfitAndLossUrl}&filter[start_date]=${months[i - 1]}&filter[end_date]=${month}`
      )

      ?.filter(Boolean)
  }

  const { data: lastSixMonths } = useSWR(connection ? getUrls : null, multiFetcher)

  return {
    profitAndLoss: data?.data,
    isLoading: !error && !data,
    isError: data?.error || error,
    lastSixMonths: lastSixMonths
      ?.map(
        (response) =>
          response.data &&
          response.data.income &&
          response.data.income?.total < 1000229855 &&
          response.data
      )
      ?.filter(Boolean)
  }
}
