import Customers from 'components/Customers/Customers'
import Layout from 'components/Layout'
import { NextPage } from 'next'
import PageHeading from 'components/PageHeading'
import { useConnections } from 'hooks'
import { withSession } from 'utils'

const CustomersPage: NextPage = () => {
  const { connection } = useConnections()

  return (
    <Layout title="Customers">
      <PageHeading
        title="Customers"
        description={`Customer data from ${connection?.name || 'different Accounting connectors'}`}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        {connection && <Customers />}
      </div>
    </Layout>
  )
}

export default withSession(CustomersPage)
