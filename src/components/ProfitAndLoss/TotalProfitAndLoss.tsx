import ChartWrapper from 'components/ChartWrapper'
import Spinner from '../Spinner'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useProfitAndLoss } from 'hooks'
const Chart = dynamic(() => import('react-charts').then((module: any) => module.Chart), {
  ssr: false
}) as any

const TotalProfitAndLoss = () => {
  const { isLoading, lastSixMonths } = useProfitAndLoss()

  const data = useMemo(() => {
    if (!lastSixMonths) return []
    return [
      {
        label: 'Total Expenses',
        data: lastSixMonths.map((report) => ({
          total: report.expenses?.total,
          date: report.end_date
        }))
      },
      {
        label: 'Total Income',
        data: lastSixMonths.map((report) => ({
          total: report.income?.total,
          date: report.end_date
        }))
      }
    ]
  }, [lastSixMonths])

  const primaryAxis = useMemo(() => ({ getValue: (report: any) => report.date }), [])

  const secondaryAxes: any = useMemo(
    () => [{ elementType: 'area', getValue: (report: any) => report.total }],
    []
  )

  return (
    <ChartWrapper title="Income vs expenses" subTitle="Total income vs expenses of last 6 months">
      {isLoading && <Spinner />}
      {lastSixMonths && lastSixMonths?.length > 0 && (
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes
          }}
        />
      )}
    </ChartWrapper>
  )
}

export default TotalProfitAndLoss
