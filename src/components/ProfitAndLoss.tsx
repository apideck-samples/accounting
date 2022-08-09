import Spinner from './Spinner'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useProfitAndLoss } from 'hooks'
const Chart = dynamic(() => import('react-charts').then((module) => module.Chart), { ssr: false })

const ProfitAndLoss = () => {
  const { isLoading, lastSixMonths } = useProfitAndLoss()

  const data = useMemo(() => {
    if (!lastSixMonths) return []
    return [
      {
        label: 'Expenses',
        elementType: 'bar',
        data: lastSixMonths.map((report) => ({
          total: report.expenses?.total,
          date: report.end_date
        }))
      },
      {
        label: 'Income',
        elementType: 'bar',
        data: lastSixMonths.map((report) => ({
          total: report.income?.total,
          date: report.end_date
        }))
      }
    ]
  }, [lastSixMonths])

  const primaryAxis = useMemo(() => ({ getValue: (report: any) => report.date }), [])

  const secondaryAxes = useMemo(() => [{ getValue: (report: any) => report.total }], [])

  return (
    <div className="p-5 bg-white rounded-lg shadow-xl">
      <h2 className="font-medium text-lg text-gray-900">Profit and loss</h2>
      <div className="w-[500px] h-72">
        {isLoading && <Spinner />}
        {lastSixMonths && (
          <Chart
            options={{
              data,
              primaryAxis,
              secondaryAxes
            }}
          />
        )}
      </div>
    </div>
  )
}

export default ProfitAndLoss
