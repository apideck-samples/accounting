import type { ProfitAndLoss } from '@apideck/unify/models/components' // Added for explicit typing of report
import ChartWrapper from 'components/ChartWrapper'
import { useProfitAndLoss } from 'hooks'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import Spinner from '../Spinner'

const Chart = dynamic(() => import('react-charts').then((module: any) => module.Chart), {
  ssr: false
}) as any

interface MonthlyReportDataPoint {
  date: Date // Use Date object for axis
  total: number // Ensure total is number, default nulls to 0
}

const TotalProfitAndLoss = () => {
  const { isLoading, lastSixMonths } = useProfitAndLoss()

  const data = useMemo(() => {
    if (!lastSixMonths || lastSixMonths.length === 0) return []
    return [
      {
        label: 'Total Expenses',
        data: lastSixMonths.map((report: ProfitAndLoss) => ({
          total: report.expenses?.total ?? 0,
          date: new Date(report.endDate as string)
        }))
      },
      {
        label: 'Total Income',
        data: lastSixMonths.map((report: ProfitAndLoss) => ({
          total: report.income?.total ?? 0,
          date: new Date(report.endDate as string)
        }))
      }
    ]
  }, [lastSixMonths])

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum: MonthlyReportDataPoint) => datum.date,
      scaleType: 'time' // Explicitly set scale type for dates
    }),
    []
  )

  const secondaryAxes: any = useMemo(
    () => [
      {
        elementType: 'area',
        getValue: (datum: MonthlyReportDataPoint) => datum.total
      }
    ],
    []
  )

  return (
    <ChartWrapper title="Income vs expenses" subTitle="Total income vs expenses of last 6 months">
      {isLoading && <Spinner />}
      {data && data.length > 0 && data.every((series) => series.data.length > 0) && (
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes
          }}
        />
      )}
      {!isLoading &&
        (!data || data.length === 0 || data.every((series) => series.data.length === 0)) && (
          <div className="text-center py-10">
            <p className="text-gray-500">No data available for the selected period.</p>
          </div>
        )}
    </ChartWrapper>
  )
}

export default TotalProfitAndLoss
