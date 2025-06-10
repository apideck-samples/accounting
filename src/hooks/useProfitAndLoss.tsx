import { useEffect, useMemo, useState } from 'react'
import { fetcher, multiFetcher } from 'utils'

import type { ProfitAndLoss } from '@apideck/unify/models/components'
import useSWR from 'swr'
import { useConnections } from './useConnections'
import { useSession } from './useSession'

// Helper to get YYYY-MM-DD string in local timezone
const toYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth is 0-indexed
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useProfitAndLoss = () => {
  const { connection } = useConnections()
  const { session } = useSession()

  const today = new Date()
  const firstDayDefaultMonthStr = toYYYYMMDD(new Date(today.getFullYear(), 4, 1))
  const lastDayDefaultMonthStr = toYYYYMMDD(new Date(today.getFullYear(), 5, 0))

  const [startDate, setStartDate] = useState<string | null>(firstDayDefaultMonthStr)
  const [endDate, setEndDate] = useState<string | null>(lastDayDefaultMonthStr)
  const serviceId = connection?.serviceId || ''

  const profitAndLossUrl = useMemo(() => {
    if (!serviceId || !session?.jwt) {
      return null
    }

    if (startDate && endDate) {
      const d1 = new Date(startDate)
      const d2 = new Date(endDate)
      if (d1 <= d2) {
        let url = `/api/accounting/profit-and-loss?jwt=${session.jwt}&serviceId=${serviceId}`
        url += `&filter[start_date]=${startDate}&filter[end_date]=${endDate}`
        return url
      } else {
        return null // Invalid date range
      }
    } else if (startDate || endDate) {
      return null // Incomplete date range
    } else {
      return null // Both dates null
    }
  }, [endDate, serviceId, session?.jwt, startDate])

  const {
    data: singleReportData,
    error: singleReportError,
    mutate
  } = useSWR(profitAndLossUrl, fetcher)

  const getUrlsForMonthlyReports = (): string[] | null => {
    if (!serviceId || !session?.jwt) {
      return null
    }

    const reportUrls: string[] = []
    const currentDate = new Date()

    for (let i = 0; i < 7; i++) {
      const firstDayOfTargetMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      )
      const reportStartDate = toYYYYMMDD(firstDayOfTargetMonth)

      const lastDayOfTargetMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0
      )
      const reportEndDate = toYYYYMMDD(lastDayOfTargetMonth)

      reportUrls.push(
        `/api/accounting/profit-and-loss?jwt=${session.jwt}&serviceId=${serviceId}&filter[start_date]=${reportStartDate}&filter[end_date]=${reportEndDate}`
      )
    }
    const finalUrls = reportUrls.reverse()
    return finalUrls
  }

  const { data: multiMonthData, error: multiMonthError } = useSWR(
    getUrlsForMonthlyReports,
    multiFetcher
  )

  const extractedSingleReport = singleReportData?.getProfitAndLossResponse?.data as
    | ProfitAndLoss
    | undefined
  const extractedMonthlyReports = multiMonthData
    ?.map((response: any) => response?.getProfitAndLossResponse?.data)
    .filter(Boolean) as ProfitAndLoss[] | undefined

  const isLoadingSingle = !singleReportError && !singleReportData && !!profitAndLossUrl
  const isLoadingMonthly = !multiMonthError && !multiMonthData && !!getUrlsForMonthlyReports()

  useEffect(() => {
    if (singleReportError) {
      console.error('[useProfitAndLoss] Error fetching single report:', singleReportError)
    }
    if (multiMonthError) {
      console.error(
        '[useProfitAndLoss] Error fetching monthly reports (multiFetcher error):',
        multiMonthError
      )
      if (Array.isArray(multiMonthError)) {
        multiMonthError.forEach((err, index) => {
          if (err) console.error(`[useProfitAndLoss] Error for monthly report ${index}:`, err)
        })
      }
    }
  }, [singleReportError, multiMonthError])

  return useMemo(
    () => ({
      profitAndLoss: extractedSingleReport,
      filteredData: startDate && endDate && extractedSingleReport,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      mutate,
      isLoading: isLoadingSingle || isLoadingMonthly,
      isError: singleReportError || multiMonthError || singleReportData?.message,
      lastSixMonths: extractedMonthlyReports
    }),
    [
      extractedSingleReport,
      startDate,
      endDate,
      mutate,
      isLoadingSingle,
      isLoadingMonthly,
      singleReportError,
      multiMonthError,
      singleReportData,
      extractedMonthlyReports
    ]
  )
}
