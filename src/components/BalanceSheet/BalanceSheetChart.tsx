import ChartWrapper from 'components/ChartWrapper'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const Chart = dynamic(() => import('react-charts').then((module) => module.Chart), {
  ssr: false
}) as any

interface Props {
  title: string
  data: any[]
}

const BalanceSheetCard = ({ title, data }: Props) => {
  const primaryAxis = useMemo(() => ({ getValue: (report: any) => report.name }), [])
  const secondaryAxes = useMemo(() => [{ getValue: (report: any) => report.value }], [])

  return (
    <ChartWrapper title={title}>
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes
        }}
      />
    </ChartWrapper>
  )
}

export default BalanceSheetCard
