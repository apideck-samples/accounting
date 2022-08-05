import { useInvoices, withSession } from 'utils'

import Layout from 'components/Layout'
import { NextPage } from 'next'

const InvoicesPage: NextPage = () => {
  const { invoices } = useInvoices()

  console.log('invoices', invoices)

  return (
    <Layout title="Invoices">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center truncate">
        {invoices?.map((invoice) => {
          return <p key={invoice.id}>{invoice.id}</p>
        })}
      </div>
    </Layout>
  )
}

export default withSession(InvoicesPage)
