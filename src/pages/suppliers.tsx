import { Button } from '@apideck/components'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import CreateSupplierForm from 'components/Suppliers/CreateSupplierForm'
import SuppliersTable from 'components/Suppliers/SuppliersTable'
import { useConnections } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'
import { withSession } from 'utils'

const SuppliersPage: NextPage = () => {
  const { connection } = useConnections()
  const [showSupplierForm, setShowSupplierForm] = useState<boolean>(false)

  return (
    <ConnectionRequiredLayout
      title="Suppliers"
      description={`Manage and create suppliers using ${
        connection?.name || 'your accounting integration'
      }`}
    >
      <PageHeading
        title="Suppliers"
        description={`Manage and create suppliers for ${
          connection?.name || 'your accounting integration'
        }`}
        action={[
          <Button key="supplier" text="Create supplier" onClick={() => setShowSupplierForm(true)} />
        ]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200 dark:border-gray-700">
        <SuppliersTable />
      </div>
      <SlideOver
        isOpen={showSupplierForm}
        title={`Create a new supplier in ${connection?.name || 'your accounting integration'}`}
        onClose={() => {
          setShowSupplierForm(false)
        }}
      >
        <CreateSupplierForm
          closeForm={() => {
            setShowSupplierForm(false)
          }}
        />
      </SlideOver>
    </ConnectionRequiredLayout>
  )
}

export default withSession(SuppliersPage)
