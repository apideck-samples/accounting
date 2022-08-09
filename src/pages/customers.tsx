import Customers from 'components/customers/Customers'
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
        description={`Customer data from different Accounting connectors`}
      />
      {connection && <Customers />}
    </Layout>
  )
}

export default withSession(CustomersPage)
