import { useBalanceSheet } from 'hooks'

const BalanceSheet = () => {
  const { balanceSheet, isLoading } = useBalanceSheet()

  console.log('balanceSheet', balanceSheet)

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow rounded-lg p-4 text-center truncate">
      {isLoading && <p>Loading...</p>}
      <div className="text-lg">
        {balanceSheet?.report_name} {balanceSheet?.start_date}
      </div>
      <div className="mb-4 space-y-2">
        <h1>ASSETS</h1>
        <p>Total: {balanceSheet?.assets.total}</p>
        <p>Current Total: {balanceSheet?.assets.current_assets.total}</p>
        <p>
          Current accounts:{' '}
          {balanceSheet?.assets.current_assets.accounts.map((account) => account.name)?.join(', ')}
        </p>
        <p>Fixed Total: {balanceSheet?.assets.fixed_assets.total}</p>
        <p>
          Fixed accounts:{' '}
          {balanceSheet?.assets.fixed_assets.accounts.map((account) => account.name)?.join(', ')}
        </p>
      </div>
      <div className="mb-4 space-y-2">
        <h1>EQUITY</h1>
        <p>Total: {balanceSheet?.equity.total}</p>
        <p>Current Total: {balanceSheet?.equity.total}</p>
        <p>Current accounts: {balanceSheet?.equity.items.map((item) => item.name)?.join(', ')}</p>
      </div>
      <div className="mb-4 space-y-2">
        <h1>liabilities</h1>
        <p>Total: {balanceSheet?.liabilities.total}</p>
        <p>
          Liability accounts:
          {balanceSheet?.assets.fixed_assets.accounts.map((account) => account.name)?.join(', ')}
        </p>
      </div>
    </div>
  )
}

export default BalanceSheet
