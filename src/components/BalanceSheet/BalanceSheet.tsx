import { Reports as BalanceSheetReportData } from '@apideck/unify/models/components'

import { useBalanceSheet } from 'hooks'
import { useMemo } from 'react'
import BalanceSheetCard from './BalanceSheetChart'

interface ChartDataPoint {
  name: string | undefined
  value: number | undefined
}

interface ChartDataset {
  label: string
  data: ChartDataPoint[]
}

const BalanceSheet = () => {
  const { balanceSheet } = useBalanceSheet()

  const reportData: BalanceSheetReportData | undefined = balanceSheet?.reports?.[0]

  const assetsData: ChartDataset[] = useMemo(() => {
    if (!reportData?.assets?.items || !Array.isArray(reportData.assets.items)) {
      return [
        {
          label: 'Assets',
          data: [
            { name: reportData?.assets?.name || 'Total Assets', value: reportData?.assets?.value }
          ]
        }
      ]
    }
    const currentAssetsItems = reportData.assets.items.filter((item: any) =>
      item?.name?.toLowerCase().includes('current')
    )
    const fixedAssetsItems = reportData.assets.items.filter((item: any) =>
      item?.name?.toLowerCase().includes('fixed')
    )
    const otherAssetsItems = reportData.assets.items.filter(
      (item: any) =>
        !item?.name?.toLowerCase().includes('current') &&
        !item?.name?.toLowerCase().includes('fixed')
    )

    const datasets: ChartDataset[] = []

    if (currentAssetsItems.length > 0) {
      datasets.push({
        label: 'Current Assets',
        data: currentAssetsItems.map((account: any) => ({
          name: account.name,
          value: account.value
        }))
      })
    } else if (fixedAssetsItems.length === 0 && otherAssetsItems.length > 0) {
      datasets.push({
        label: reportData.assets.name || 'Assets',
        data: otherAssetsItems.map((account: any) => ({ name: account.name, value: account.value }))
      })
    }

    if (fixedAssetsItems.length > 0) {
      datasets.push({
        label: 'Fixed Assets',
        data: fixedAssetsItems.map((account: any) => ({ name: account.name, value: account.value }))
      })
    }

    if (datasets.length === 0 && reportData.assets.items.length > 0) {
      datasets.push({
        label: reportData.assets.name || 'Assets',
        data: reportData.assets.items.map((account: any) => ({
          name: account.name,
          value: account.value
        }))
      })
    } else if (datasets.length === 0) {
      datasets.push({
        label: 'Assets',
        data: [
          { name: reportData?.assets?.name || 'Total Assets', value: reportData?.assets?.value }
        ]
      })
    }

    return datasets
  }, [reportData])

  const liabilitiesData: ChartDataset[] = useMemo(() => {
    if (
      !reportData?.liabilities?.items ||
      !Array.isArray(reportData.liabilities.items) ||
      reportData.liabilities.items.length === 0
    ) {
      return [
        {
          label: 'Liabilities',
          data: [
            {
              name: reportData?.liabilities?.name || 'Total Liabilities',
              value: reportData?.liabilities?.value
            }
          ]
        }
      ]
    }
    return [
      {
        label: reportData.liabilities.name || 'Liabilities',
        data: reportData.liabilities.items.map((account: any) => ({
          name: account.name,
          value: account.value
        }))
      }
    ]
  }, [reportData])

  const equityData: ChartDataset[] = useMemo(() => {
    if (
      !reportData?.equity?.items ||
      !Array.isArray(reportData.equity.items) ||
      reportData.equity.items.length === 0
    ) {
      return [
        {
          label: 'Equity',
          data: [
            { name: reportData?.equity?.name || 'Total Equity', value: reportData?.equity?.value }
          ]
        }
      ]
    }
    return [
      {
        label: reportData.equity.name || 'Equity',
        data: reportData.equity.items.map((item: any) => ({ name: item.name, value: item.value }))
      }
    ]
  }, [reportData])

  const displayAssetsData =
    assetsData.length > 0
      ? assetsData
      : [
          {
            label: 'Assets',
            data: [
              { name: reportData?.assets?.name || 'Total Assets', value: reportData?.assets?.value }
            ]
          }
        ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
      {displayAssetsData.map((dataset) => (
        <BalanceSheetCard key={dataset.label} title={dataset.label} data={[dataset]} />
      ))}
      <BalanceSheetCard title={liabilitiesData[0]?.label || 'Liabilities'} data={liabilitiesData} />
      <BalanceSheetCard title={equityData[0]?.label || 'Equity'} data={equityData} />
    </div>
  )
}

export default BalanceSheet
