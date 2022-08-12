import { fetcher, multiFetcher } from 'utils'
import { useMemo, useState } from 'react'

import { useConnections } from './useConnections'
import useSWR from 'swr'
import { useSession } from './useSession'

export const useProfitAndLoss = () => {
  const { connection } = useConnections()
  const { session } = useSession()

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const serviceId = connection?.service_id || ''

  const profitAndLossUrl = useMemo(() => {
    if (!serviceId) return null
    let url = `/api/accounting/profit-and-loss?jwt=${session?.jwt}&serviceId=${serviceId}`
    if (startDate && endDate) {
      url += `&filter[start_date]=${startDate}&filter[end_date]=${endDate}`
    }
    return url
  }, [endDate, serviceId, session?.jwt, startDate])

  const { data, error, mutate } = useSWR(profitAndLossUrl, fetcher)

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

  const getUrls = () => {
    const months = getLastNMonths()
    return months
      .map(
        (month, i) =>
          months[i - 1] &&
          `/api/accounting/profit-and-loss?jwt=${
            session?.jwt
          }&serviceId=${serviceId}&filter[start_date]=${months[i - 1]}&filter[end_date]=${month}`
      )

      ?.filter(Boolean)
  }

  const { data: lastSixMonths } = useSWR(connection ? getUrls : null, multiFetcher)

  return useMemo(
    () => ({
      profitAndLoss: data?.data,
      filteredData: startDate && endDate && data?.data,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      mutate,
      isLoading: !error && !data,
      isError: data?.error || error,
      lastSixMonths: lastSixMonths?.map((response) => response.data)?.filter(Boolean)
    }),
    [data, endDate, error, lastSixMonths, mutate, startDate]
  )
}
