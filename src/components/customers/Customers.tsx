import { AccountingCustomer } from '@apideck/node'
import CustomerCard from './CustomerCard'
import Spinner from 'components/Spinner'
import { useCustomers } from 'hooks'

const Customers = () => {
  const { customers, isLoading } = useCustomers()

  return (
    <>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers?.map((customer: AccountingCustomer) => (
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
