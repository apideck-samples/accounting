import { Button } from '@apideck/components'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import PageHeading from 'components/PageHeading'
import CreatePurchaseOrderForm from 'components/PurchaseOrders/CreatePurchaseOrderForm'
import PurchaseOrdersTable from 'components/PurchaseOrders/PurchaseOrdersTable'
import SlideOver from 'components/SlideOver'
import { useConnections } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'
import { withSession } from 'utils'

const PurchaseOrdersPage: NextPage = () => {
  const { connection } = useConnections()
  const [showPurchaseOrderForm, setShowPurchaseOrderForm] = useState<boolean>(false)

  return (
    <ConnectionRequiredLayout
      title="Purchase Orders"
      description={`Manage and create purchase orders using ${
        connection?.name || 'your accounting integration'
      }`}
    >
      <PageHeading
        title="Purchase Orders"
        description={`Manage and create purchase orders for ${
          connection?.name || 'your accounting integration'
        }`}
        action={[
          <Button
            key="po"
            text="Create purchase order"
            onClick={() => setShowPurchaseOrderForm(true)}
          />
        ]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200 dark:border-gray-700">
        <PurchaseOrdersTable />
      </div>
      <SlideOver
        isOpen={showPurchaseOrderForm}
        title={`Create a new purchase order in ${
          connection?.name || 'your accounting integration'
        }`}
        onClose={() => {
          setShowPurchaseOrderForm(false)
        }}
      >
        <CreatePurchaseOrderForm
          closeForm={() => {
            setShowPurchaseOrderForm(false)
          }}
        />
      </SlideOver>
    </ConnectionRequiredLayout>
  )
}

export default withSession(PurchaseOrdersPage)
