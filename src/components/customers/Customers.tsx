import { AccountingCustomer } from '@apideck/node'
import CustomerCard from './CustomerCard'
import PageLoader from 'components/PageLoader'
import { Suspense } from 'react'
import { Waypoint } from 'react-waypoint'
import { useCustomers } from 'utils'

const Customers = () => {
  const { customers, isLoading, hasNextPage, nextPage } = useCustomers()

  const showWaypoint = customers?.length && !isLoading && hasNextPage

  return (
    <Suspense fallback={<PageLoader />}>
      <ul role="list" className="py-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers?.map((customer: AccountingCustomer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </ul>
      {showWaypoint && <Waypoint onEnter={nextPage} />}
    </Suspense>
  )
}
export default Customers
