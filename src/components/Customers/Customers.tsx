import { Button } from '@apideck/components'
import type { Customer } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import Spinner from 'components/Spinner'
import { useCustomers, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import { HiExclamation, HiOutlineUserGroup } from 'react-icons/hi'
import CustomerCard from './CustomerCard'

const Customers = () => {
  const { customers, isLoading, error } = useCustomers() // Add error to destructuring
  const [vaultOpen, setVaultOpen] = useState(false)
  const { session } = useSession()

  useEffect(() => {
    if (vaultOpen && session?.jwt) {
      ApideckVault.open({
        token: session.jwt as string,
        showAttribution: true,
        unifiedApi: 'accounting',
        onClose: () => setVaultOpen(false)
      })
    }
  }, [vaultOpen, session])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 p-4 text-center">
        <Spinner />
      </div>
    )
  }

  // Error State - This will now catch the 403 Forbidden error
  if (error) {
    return (
      <div
        className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded-lg shadow fade-in"
        data-testid="error-state"
      >
        <HiExclamation className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-red-800 dark:text-red-300">
          {(error as any)?.message || 'An error occurred'}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {(error as any)?.detail?.message || JSON.stringify((error as any)?.detail) || ''}
        </p>
        {/* Specific action for permission-related errors */}
        {((error as any)?.statusCode === 401 ||
          (error as any)?.statusCode === 402 ||
          (error as any)?.statusCode === 403) && (
          <>
            <p className="mt-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
              This could be an issue with the connection&apos;s permissions or subscription.
            </p>
            <Button
              text="Re-authorize connection"
              onClick={() => setVaultOpen(true)}
              variant="primary"
            />
          </>
        )}
      </div>
    )
  }

  // Empty State
  if (!customers || customers.length === 0) {
    return (
      <div
        className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded-lg shadow fade-in"
        data-testid="empty-state"
      >
        <HiOutlineUserGroup className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No customers found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new customer.
        </p>
      </div>
    )
  }

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {customers?.map((customer: Customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </ul>
  )
}
export default Customers
