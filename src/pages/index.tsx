import { useInvoices, withSession } from 'utils'

import { Invoice } from '@apideck/node'
import Layout from 'components/Layout'
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  const { invoices, isLoading } = useInvoices() // Example of using custom hook to fetch from Accounting API.

  return (
    <Layout title="Invoices">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center truncate">
        {isLoading && <p>Loading...</p>}
        {invoices?.map((invoice: Invoice) => {
          return <p key={invoice.id}>{invoice.id}</p>
        })}
      </div>
    </Layout>
  )
}

export default withSession(IndexPage)
