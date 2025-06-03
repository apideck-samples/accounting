import { Button } from '@apideck/components'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import CreateCustomerForm from 'components/Customers/CreateCustomerForm'
import CreateInvoiceForm from 'components/Invoices/CreateInvoiceForm'
import CreateInvoiceItemForm from 'components/Invoices/CreateInvoiceItemForm'
import InvoicesTable from 'components/Invoices/InvoicesTable'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import { useConnections } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'
import { withSession } from 'utils'

const InvoicesPage: NextPage = () => {
  const { connection } = useConnections()
  const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false)
  const [showInvoiceItemForm, setShowInvoiceItemForm] = useState<boolean>(false)
  const [showCustomerForm, setShowCustomerForm] = useState<boolean>(false)

  return (
    <ConnectionRequiredLayout
      title="Invoices"
      description={`Manage and create invoices using ${connection?.name}`}
    >
      <PageHeading
        title="Invoices"
        description={`Manage and create invoices using ${connection?.name}`}
        action={[
          <Button key="invoice" text="Create invoice" onClick={() => setShowInvoiceForm(true)} />
        ]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <InvoicesTable />
      </div>
      <SlideOver
        isOpen={showInvoiceForm}
        title={`Create a new invoice in ${connection?.name}`}
        onClose={() => {
          setShowInvoiceForm(false)
        }}
      >
        <CreateInvoiceForm
          closeForm={() => {
            setShowInvoiceForm(false)
          }}
          openCustomerForm={() => {
            setShowInvoiceForm(false)
            setShowCustomerForm(true)
          }}
          openInvoiceItemsForm={() => {
            setShowInvoiceForm(false)
            setShowInvoiceItemForm(true)
          }}
        />
      </SlideOver>
      <SlideOver
        isOpen={showCustomerForm}
        title={`Create customer for ${connection?.name}`}
        onClose={() => {
          setShowCustomerForm(false)
          setShowInvoiceForm(true)
        }}
      >
        <CreateCustomerForm
          closeForm={() => {
            setShowCustomerForm(false)
            setShowInvoiceForm(true)
          }}
        />
      </SlideOver>
      <SlideOver
        isOpen={showInvoiceItemForm}
        title={`Create invoice item for ${connection?.name}`}
        onClose={() => {
          setShowInvoiceItemForm(false)
          setShowInvoiceForm(true)
        }}
      >
        <CreateInvoiceItemForm
          closeForm={() => {
            setShowInvoiceItemForm(false)
            setShowInvoiceForm(true)
          }}
        />
      </SlideOver>
    </ConnectionRequiredLayout>
  )
}

export default withSession(InvoicesPage)
