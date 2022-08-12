import {
  BalanceSheetAssetsCurrentAssetsAccounts,
  BalanceSheetAssetsFixedAssetsAccounts,
  BalanceSheetEquityItems,
  BalanceSheetLiabilitiesAccounts
} from '@apideck/node'

import BalanceSheetCard from './BalanceSheetChart'
import { useBalanceSheet } from 'hooks'
import { useMemo } from 'react'

const BalanceSheet = () => {
  const { balanceSheet } = useBalanceSheet()

  const currentAssetsData = useMemo(() => {
    return [
      {
        label: 'Current Assets',
        data: balanceSheet?.assets.current_assets.accounts.map(
          (account: BalanceSheetAssetsCurrentAssetsAccounts) => ({
            value: account.value,
            name: account.name
          })
        )
      }
    ]
  }, [balanceSheet])

  const fixedAssetsData = useMemo(() => {
    return [
      {
        label: 'Fixed Assets',
        data: balanceSheet?.assets.fixed_assets.accounts.map(
          (account: BalanceSheetAssetsFixedAssetsAccounts) => ({
            value: account.value,
            name: account.name
          })
        )
      }
    ]
  }, [balanceSheet])

  const equityData = useMemo(() => {
    return [
      {
        label: 'Equity',
        data: balanceSheet?.equity.items.map((item: BalanceSheetEquityItems) => ({
          value: item.value,
          name: item.name
        }))
      }
    ]
  }, [balanceSheet])

  const liabilitiesData = useMemo(() => {
    return [
      {
        label: 'Liabilities',
        data: balanceSheet?.liabilities.accounts.map(
          (account: BalanceSheetLiabilitiesAccounts) => ({
            value: account.value,
            name: account.name
          })
        )
      }
    ]
  }, [balanceSheet])

  return (
    <div className="grid grid-cols-2 gap-6 xl:gap-8">
      <BalanceSheetCard title="Current Assets" data={currentAssetsData} />
      <BalanceSheetCard title="Fixed Assets" data={fixedAssetsData} />
      <BalanceSheetCard title="Equity" data={equityData} />
      <BalanceSheetCard title="Liabilities" data={liabilitiesData} />
    </div>
  )
}

export default BalanceSheet
