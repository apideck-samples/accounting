import { Invoice } from '@apideck/node'
import Layout from 'components/Layout'
import { NextPage } from 'next'
import { useInvoices } from 'hooks'
import { withSession } from 'utils'

const InvoicesPage: NextPage = () => {
  const { invoices } = useInvoices()

  console.log('invoices', invoices)

  return (
    <Layout title="Invoices">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center truncate">
        {invoices?.map((invoice: Invoice) => {
          return <p key={invoice.id}>{invoice.id}</p>
        })}
      </div>
    </Layout>
  )
}

export default withSession(InvoicesPage)
