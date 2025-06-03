import { useBalanceSheet, useConnections } from 'hooks'

import BalanceSheet from 'components/BalanceSheet/BalanceSheet'
import BalanceSheetStats from 'components/BalanceSheet/BalanceSheetStats'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import PageHeading from 'components/PageHeading'
import Spinner from 'components/Spinner'
import { NextPage } from 'next'
import { withSession } from 'utils'

const BalanceSheetPage: NextPage = () => {
  const { balanceSheet, isLoading } = useBalanceSheet()
  const { connection } = useConnections()

  return (
    <ConnectionRequiredLayout
      title="Balance Sheet"
      description={`Balance sheet for ${connection?.name || 'your business'}`}
    >
      <PageHeading title="Balance Sheet" />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <BalanceSheetStats />
        {isLoading && (
          <div className="h-72 flex items-center justify-center fade-in">
            <Spinner />
          </div>
        )}
        {balanceSheet && <BalanceSheet />}
      </div>
    </ConnectionRequiredLayout>
  )
}

export default withSession(BalanceSheetPage)
