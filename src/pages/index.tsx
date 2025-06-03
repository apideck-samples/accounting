import { Button } from '@apideck/components'
import CreateCustomerForm from 'components/Customers/CreateCustomerForm'
import CreateInvoiceForm from 'components/Invoices/CreateInvoiceForm'
import CreateInvoiceItemForm from 'components/Invoices/CreateInvoiceItemForm'
import InvoicesTable from 'components/Invoices/InvoicesTable'
import Layout from 'components/Layout'
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
    <Layout title="Invoices">
      <PageHeading
        title="Invoices"
        description={`Invoices from ${connection?.name || 'different accounting connectors'}`}
        action={[
          <Button key="invoice" text="Create invoice" onClick={() => setShowInvoiceForm(true)} />
        ]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        {connection?.enabled ? (
          <InvoicesTable />
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No service selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please select a service from the sidebar menu to get started.
            </p>
          </div>
        )}
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
    </Layout>
  )
}

export default withSession(InvoicesPage)
