import Layout from 'components/Layout'
import { NextPage } from 'next'
import PageHeading from 'components/PageHeading'
import PaymentsTable from 'components/payments/PaymentsTable'
import { useConnections } from 'hooks'
import { withSession } from 'utils'

const PaymentsPage: NextPage = () => {
  const { connection } = useConnections()

  return (
    <Layout title="Invoices">
      <PageHeading
        title="Payments"
        description={`Payments from ${connection?.name || 'different accounting connectors'}`}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <PaymentsTable />
      </div>
    </Layout>
  )
}

export default withSession(PaymentsPage)
