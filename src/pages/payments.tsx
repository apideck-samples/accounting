import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import PageHeading from 'components/PageHeading'
import PaymentsTable from 'components/payments/PaymentsTable'
import { useConnections } from 'hooks'
import { NextPage } from 'next'
import { withSession } from 'utils'

const PaymentsPage: NextPage = () => {
  const { connection } = useConnections()

  return (
    <ConnectionRequiredLayout
      title="Payments"
      description={`Manage payments from ${connection?.name || 'your business'}`}
    >
      <PageHeading title="Payments" description={`Manage payments from ${connection?.name}`} />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <PaymentsTable />
      </div>
    </ConnectionRequiredLayout>
  )
}

export default withSession(PaymentsPage)
