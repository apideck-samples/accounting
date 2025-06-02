import type { ProfitAndLoss as ProfitAndLossInterface } from '@apideck/unify/models/components'
import ChartWrapper from 'components/ChartWrapper'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const Chart = dynamic(() => import('react-charts').then((module: any) => module.Chart), {
  ssr: false
}) as any

interface ProfitAndLossRecordItem {
  title: string // title should ideally always be a string for chart axis
  value: number // value should be a number for chart axis
}

interface Props {
  profitAndLoss: ProfitAndLossInterface | undefined // Allow undefined as it comes from hook
  type?: 'income' | 'expenses' // This prop determines which section to display
}

const ProfitAndLoss = ({ profitAndLoss, type = 'income' }: Props) => {
  const data = useMemo(() => {
    if (!profitAndLoss) return []

    const section = type === 'income' ? profitAndLoss.income : profitAndLoss.expenses
    // The `records` property is `any[] | undefined` in the SDK type, needs careful handling.
    const records = section?.records as
      | Array<{ title?: string; name?: string; value?: number | null }>
      | undefined

    let chartDataPoints: ProfitAndLossRecordItem[]

    if (records && records.length > 0) {
      chartDataPoints = records.map((record) => ({
        title: record.title || record.name || 'Unnamed Record', // Prioritize title, then name
        value: record.value ?? 0 // Default null/undefined value to 0
      }))
    } else {
      // Fallback: show a single bar for the total of the section if no detailed records
      chartDataPoints = [
        {
          title: section?.title || (type === 'income' ? 'Total Income' : 'Total Expenses'),
          value: section?.total ?? 0
        }
      ]
    }

    // If even the fallback title is somehow undefined (e.g. section is undefined), provide a final default.
    if (chartDataPoints.length === 1 && !chartDataPoints[0].title) {
      chartDataPoints[0].title = type === 'income' ? 'Income' : 'Expenses'
    }

    return [
      {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: chartDataPoints
      }
    ]
  }, [profitAndLoss, type])

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum: ProfitAndLossRecordItem) => datum.title
      // Consider adding scaleType: 'band' if titles are categorical and might be few
    }),
    []
  )

  const secondaryAxes: any = useMemo(
    () => [
      {
        elementType: 'bar',
        getValue: (datum: ProfitAndLossRecordItem) => datum.value
      }
    ],
    []
  )

  // Only render chart if there is data to display after processing
  const hasChartData =
    data.length > 0 &&
    data[0].data.length > 0 &&
    // Ensure at least one data point has a non-zero value if only total is shown
    (data[0].data.length > 1 ||
      data[0].data[0]?.value !== 0 ||
      data[0].data[0]?.title.toLowerCase().includes('total'))

  return profitAndLoss ? (
    <ChartWrapper
      title={type.charAt(0).toUpperCase() + type.slice(1)}
      subTitle={
        // Use camelCase: startDate, endDate
        profitAndLoss
          ? `From ${
              profitAndLoss?.startDate
                ? new Date(profitAndLoss?.startDate).toLocaleDateString()
                : 'N/A'
            } to ${
              profitAndLoss?.endDate ? new Date(profitAndLoss?.endDate).toLocaleDateString() : 'N/A'
            }`
          : 'Loading...'
      }
    >
      {hasChartData ? (
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes
          }}
        />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No detailed {type} records for this period.</p>
        </div>
      )}
    </ChartWrapper>
  ) : null
}

export default ProfitAndLoss
