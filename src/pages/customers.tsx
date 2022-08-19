import { Button } from '@apideck/components'
import CreateCustomerForm from 'components/Customers/CreateCustomerForm'
import Customers from 'components/Customers/Customers'
import Layout from 'components/Layout'
import { NextPage } from 'next'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import { useConnections } from 'hooks'
import { useState } from 'react'
import { withSession } from 'utils'

const CustomersPage: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { connection } = useConnections()

  return (
    <Layout title="Customers">
      <PageHeading
        title="Customers"
        description={`Customer data from ${connection?.name || 'different Accounting connectors'}`}
        action={[<Button key="invoice" text="Create customer" onClick={() => setIsOpen(true)} />]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        {connection && <Customers />}
      </div>
      <SlideOver
        isOpen={isOpen}
        title={`Create a new customer in ${connection?.name}`}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        <CreateCustomerForm closeForm={() => setIsOpen(false)} />
      </SlideOver>
    </Layout>
  )
}

export default withSession(CustomersPage)
