import { Button, Chip } from '@apideck/components'
import { useSession, useSuppliers } from 'hooks' // Ensure useSuppliers is imported
import { HiExclamation, HiOutlineOfficeBuilding } from 'react-icons/hi'

import type { Email, PhoneNumber, Supplier } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import SlideOver from 'components/SlideOver'
import { useEffect, useState } from 'react'
import SupplierDetails from './SupplierDetails' // Import SupplierDetails
import SuppliersTableLoadingRow from './SuppliersTableLoadingRow' // Import SuppliersTableLoadingRow

const SuppliersTable = () => {
  const { suppliers, error, isLoading, hasNextPage, hasPrevPage, nextPage, prevPage } =
    useSuppliers()

  const [selectedSupplier, setSelectedSupplier] = useState<null | Supplier>(null)
  const [vaultOpen, setVaultOpen] = useState(false)
  const { session } = useSession()
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

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

  const getPrimaryEmail = (emails: Email[] | undefined | null): string => {
    if (!emails || emails.length === 0) return 'N/A'
    return emails.find((e) => e.type === 'primary')?.email || emails[0].email || 'N/A'
  }

  const getPrimaryPhone = (phones: PhoneNumber[] | undefined | null): string => {
    if (!phones || phones.length === 0) return 'N/A'
    return phones.find((p) => p.type === 'primary')?.number || phones[0].number || 'N/A'
  }

  return (
    <div className="sm:px-4 md:px-0">
      <div className="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 sm:-mx-6 md:mx-0 sm:rounded-lg fade-up">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
              >
                Display Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell"
              >
                Company Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Tax Number
              </th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {suppliers?.map((supplier: Supplier) => (
              <tr
                key={supplier.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 overflow-visible fade-in"
                onClick={() => {
                  setSelectedSupplier(supplier)
                  setIsSlideOverOpen(true)
                }}
              >
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:w-auto sm:max-w-none sm:pl-6">
                  {supplier.displayName || 'N/A'}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Company Name</dt>
                    <dd className="mt-1 truncate text-gray-700 dark:text-gray-300">
                      {supplier.companyName}
                    </dd>
                    <dt className="sr-only sm:hidden">Email</dt>
                    <dd className="mt-1 truncate text-gray-500 dark:text-gray-400 sm:hidden">
                      {getPrimaryEmail(supplier.emails)}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                  {supplier.companyName || 'N/A'}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                  {getPrimaryEmail(supplier.emails)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {getPrimaryPhone(supplier.phoneNumbers)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {supplier.status && (
                    <Chip
                      label={supplier.status.toString()}
                      size="small"
                      className="uppercase"
                      colorClassName={
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }
                    />
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {supplier.taxNumber || 'N/A'}
                </td>
              </tr>
            ))}
            {isLoading &&
              [...new Array(10).keys()].map((i) => <SuppliersTableLoadingRow key={i} />)}
          </tbody>
        </table>

        {/* Empty State */}
        {!isLoading && suppliers && suppliers.length === 0 && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineOfficeBuilding className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No suppliers</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new supplier.
            </p>
            {/* Optional: Add create button here if not in PageHeading */}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="error-state"
          >
            <HiExclamation className="mx-auto h-12 w-12 text-red-400 dark:text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
              Failed to load suppliers
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {(error as any)?.message || JSON.stringify(error)}
            </p>
            {(error as any)?.message === 'Unauthorized' && (
              <div className="mt-4">
                <Button
                  text="Authorize Integration"
                  onClick={() => setVaultOpen(true)}
                  variant="danger"
                />
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {((suppliers && suppliers.length > 0) || isLoading) && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
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
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <Button
                    onClick={prevPage}
                    disabled={!hasPrevPage || isLoading}
                    text="Previous"
                    variant="outline"
                    className="relative inline-flex items-center rounded-l-md"
                  />
                  <Button
                    onClick={nextPage}
                    disabled={!hasNextPage || isLoading}
                    text="Next"
                    variant="outline"
                    className="relative inline-flex items-center rounded-r-md"
                  />
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        title={selectedSupplier?.displayName || selectedSupplier?.companyName || 'Supplier Details'}
        onClose={() => {
          setIsSlideOverOpen(false)
          setSelectedSupplier(null) // Clear selection on close
        }}
      >
        {selectedSupplier && (
          <SupplierDetails
            supplier={selectedSupplier}
            onClose={() => {
              setIsSlideOverOpen(false)
              setSelectedSupplier(null)
            }}
          />
        )}
      </SlideOver>
    </div>
  )
}

export default SuppliersTable
