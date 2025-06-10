import { Button, Chip } from '@apideck/components'
import { usePurchaseOrders, useSession } from 'hooks'
import { HiExclamation, HiOutlineDocumentSearch } from 'react-icons/hi'

import type { PurchaseOrder } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import SlideOver from 'components/SlideOver'
import { useEffect, useState } from 'react'
import PurchaseOrderDetail from './PurchaseOrderDetail'
import PurchaseOrdersTableLoadingRow from './PurchaseOrdersTableLoadingRow'

const PurchaseOrdersTable = () => {
  const { purchaseOrders, error, isLoading, hasNextPage, hasPrevPage, nextPage, prevPage } =
    usePurchaseOrders()

  const [selectedPO, setSelectedPO] = useState<null | PurchaseOrder>(null)
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
                PO Number
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell"
              >
                Supplier
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
              >
                Issued Date
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
              >
                Delivery Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {purchaseOrders?.map((po: PurchaseOrder) => (
              <tr
                key={po.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 overflow-visible fade-in"
                onClick={() => {
                  setSelectedPO(po)
                  setIsSlideOverOpen(true)
                }}
              >
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:w-auto sm:max-w-none sm:pl-6">
                  {po.poNumber || po.id}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Supplier</dt>
                    <dd className="mt-1 truncate text-gray-700 dark:text-gray-300">
                      {po.supplier?.displayName || po.supplier?.companyName}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                  {po.supplier?.displayName || po.supplier?.companyName}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                  {po.issuedDate ? new Date(String(po.issuedDate)).toLocaleDateString() : 'N/A'}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                  {po.deliveryDate ? new Date(String(po.deliveryDate)).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Intl.NumberFormat(po.currency || 'USD', {
                    style: 'currency',
                    currency: po.currency || 'USD'
                  }).format(po.total || 0)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {po.status && (
                    <Chip
                      label={po.status.toString()}
                      size="small"
                      className="uppercase"
                      colorClassName={
                        'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-blue-100'
                      }
                    />
                  )}
                </td>
              </tr>
            ))}
            {isLoading &&
              [...new Array(10).keys()].map((i) => <PurchaseOrdersTableLoadingRow key={i} />)}
          </tbody>
        </table>

        {!isLoading && purchaseOrders && purchaseOrders.length === 0 && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No purchase orders
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new purchase order.
            </p>
          </div>
        )}

        {error && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="error-state"
          >
            <HiExclamation className="mx-auto h-12 w-12 text-red-400 dark:text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
              Failed to load purchase orders
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

        {((purchaseOrders && purchaseOrders.length > 0) || isLoading) && (
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
        title={`Purchase Order ${selectedPO?.poNumber || selectedPO?.id || ''}`}
        onClose={() => {
          setIsSlideOverOpen(false)
          setSelectedPO(null)
        }}
      >
        {selectedPO && (
          <PurchaseOrderDetail
            purchaseOrder={selectedPO}
            onClose={() => {
              setIsSlideOverOpen(false)
              setSelectedPO(null)
            }}
          />
        )}
      </SlideOver>
    </div>
  )
}

export default PurchaseOrdersTable
