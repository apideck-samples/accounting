import { Button } from '@apideck/components'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import CreateCustomerForm from 'components/Customers/CreateCustomerForm'
import Customers from 'components/Customers/Customers'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import { useConnections, useCustomers } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'
import { withSession } from 'utils'

const CustomersPage: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { connection } = useConnections()
  const { nextPage, prevPage, hasNextPage, hasPrevPage, isLoading } = useCustomers()

  return (
    <ConnectionRequiredLayout title="Customers" pageTitle="Customers">
      <PageHeading
        title="Customers"
        description={`Manage customer data from ${connection?.name}`}
        action={[<Button key="invoice" text="Create customer" onClick={() => setIsOpen(true)} />]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <Customers />
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4 pb-4">
        <Button
          onClick={prevPage}
          disabled={!hasPrevPage || isLoading}
          text="Previous"
          variant="outline"
        />
        <Button
          onClick={nextPage}
          disabled={!hasNextPage || isLoading}
          text="Next"
          variant="outline"
        />
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
    </ConnectionRequiredLayout>
  )
}

export default withSession(CustomersPage)
