import { Button } from '@apideck/components'
import CreateInvoiceForm from 'components/Invoices/CreateInvoiceForm'
import InvoicesTable from 'components/Invoices/InvoicesTable'
import Layout from 'components/Layout'
import { NextPage } from 'next'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import { useConnections } from 'hooks'
import { useState } from 'react'
import { withSession } from 'utils'

const InvoicesPage: NextPage = () => {
  const { connection } = useConnections()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Layout title="Invoices">
      <PageHeading
        title="Invoices"
        description={`Invoices from ${connection?.name || 'different accounting connectors'}`}
        action={[<Button key="invoice" text="Create invoice" onClick={() => setIsOpen(true)} />]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <InvoicesTable />
      </div>

      <SlideOver
        isOpen={isOpen}
        title={`Create Invoice`}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        <CreateInvoiceForm closeForm={() => setIsOpen(false)} />
      </SlideOver>
    </Layout>
  )
}

export default withSession(InvoicesPage)
