import { useBalanceSheet, useConnections } from 'hooks'

import BalanceSheet from 'components/BalanceSheet/BalanceSheet'
import BalanceSheetStats from 'components/BalanceSheet/BalanceSheetStats'
import Layout from 'components/Layout'
import PageHeading from 'components/PageHeading'
import Spinner from 'components/Spinner'
import { NextPage } from 'next'
import { withSession } from 'utils'

const BalanceSheetPage: NextPage = () => {
  const { connection } = useConnections()
  const { balanceSheet, isLoading } = useBalanceSheet()

  if (!connection)
    return (
      <Layout title="Dashboard" description="Get started by selecting a connection">
        <div />
      </Layout>
    )

  return (
    <Layout title="Balance Sheet">
      <PageHeading
        title="Balance Sheet"
        description={`Report name: "${balanceSheet?.report_name}". Start Date: ${balanceSheet?.start_date}.`}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <BalanceSheetStats />
        {isLoading && (
          <div className="h-72 flex items-center justify-center fade-in">
            <Spinner />
          </div>
        )}
        {balanceSheet && <BalanceSheet />}
      </div>
    </Layout>
  )
}

export default withSession(BalanceSheetPage)
