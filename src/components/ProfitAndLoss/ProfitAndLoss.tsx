import ChartWrapper from 'components/ChartWrapper'
import type { ProfitAndLoss as ProfitAdnLossInterface } from '@apideck/node'
import { ProfitAndLossRecord } from '@apideck/node'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const Chart = dynamic(() => import('react-charts').then((module) => module.Chart), {
  ssr: false
}) as any

interface Props {
  profitAndLoss: ProfitAdnLossInterface
  type?: 'income' | 'expenses'
}

const ProfitAndLoss = ({ profitAndLoss, type = 'income' }: Props) => {
  const data = useMemo(() => {
    if (!profitAndLoss) return []
    return [
      {
        label: type,
        data: profitAndLoss[type]?.records?.map((record: ProfitAndLossRecord) => ({
          value: record.value,
          title: record.title
        })) || [
          {
            value: 0,
            title: ''
          }
        ]
      }
    ]
  }, [profitAndLoss, type])

  const primaryAxis = useMemo(() => ({ getValue: (data: any) => data.title }), [])

  const secondaryAxes: any = useMemo(
    () => [{ elementType: 'bar', getValue: (data: any) => data.value }],
    []
  )

  return (
    <ChartWrapper
      title={type}
      subTitle={`From ${profitAndLoss?.start_date} to ${profitAndLoss?.end_date}`}
    >
      {profitAndLoss && (
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

export default ProfitAndLoss
