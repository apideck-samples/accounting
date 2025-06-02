// import { AccountingCustomer } from '@apideck/node' // Old import
import type { Customer } from '@apideck/unify/models/components' // New import
import Spinner from 'components/Spinner'
import { useCustomers } from 'hooks'
import CustomerCard from './CustomerCard'

const Customers = () => {
  const { customers, isLoading } = useCustomers() // useCustomers now returns Customer[] | undefined

  return (
    <>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Ensure customers array is correctly typed from useCustomers */}
        {customers?.map((customer: Customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </ul>
      {isLoading && (
        <div className="flex items-center justify-center h-64 p-4 text-center">
          <Spinner />
        </div>
      )}
    </>
  )
}
export default Customers
