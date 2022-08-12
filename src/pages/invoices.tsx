import { useConnections, useInvoices } from 'hooks'

import InvoicesTable from 'components/Invoices/InvoicesTable'
import Layout from 'components/Layout'
import { NextPage } from 'next'
import PageHeading from 'components/PageHeading'
import { withSession } from 'utils'

const InvoicesPage: NextPage = () => {
  const { connection } = useConnections()
  const { invoices } = useInvoices()

  console.log('invoices', invoices)

  return (
    <Layout title="Invoices">
      <PageHeading
        title="Invoices"
        description={`Invoices from ${connection?.name || 'different accounting connectors'}`}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <InvoicesTable />
      </div>
    </Layout>
  )
}

export default withSession(InvoicesPage)
