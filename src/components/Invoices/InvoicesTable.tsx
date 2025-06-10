import { Button, Chip } from '@apideck/components'
import { useInvoices, useSession } from 'hooks'
import { HiExclamation, HiOutlineDocumentSearch } from 'react-icons/hi'

import type { Invoice } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import SlideOver from 'components/SlideOver'
import { useEffect, useState } from 'react'
import InvoiceDetails from './InvoiceDetails'
import InvoicesTableLoadingRow from './InvoicesTableLoadingRow'

const InvoicesTable = () => {
  const { invoices, error, isLoading, hasNextPage, hasPrevPage, nextPage, prevPage } = useInvoices()

  const [selectedInvoice, setSelectedInvoice] = useState<null | Invoice>(null)
  const [vaultOpen, setVaultOpen] = useState(false)
  const { session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

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

  const createdOrUpdatedAtText =
    invoices && invoices.length > 0 && invoices[0]?.createdAt ? 'Created at' : 'Updated at'
  const showStatusColumn = invoices && invoices.length > 0 && invoices[0]?.status

  return (
    <div className="sm:px-4 md:px-0">
      <div className="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 sm:rounded-lg fade-up">
        {/* Invoice Table */}
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 ">
                <span className="whitespace-nowrap">Number</span>
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6"
              >
                Customer
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-medium text-gray-900 sm:table-cell"
              >
                <span className="whitespace-nowrap">Customer Memo</span>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                {createdOrUpdatedAtText}
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                Due Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                Total
              </th>
              {showStatusColumn && (
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 "
                >
                  <span className="whitespace-nowrap">Status</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {invoices?.map((invoice: Invoice) => {
              const currency = invoice?.currency?.toString() || 'USD'
              const createdOrUpdatedAtValue = invoice.createdAt || invoice.updatedAt
              const dueDateValue = invoice.dueDate

              return (
                <tr
                  key={invoice.id}
                  className="cursor-pointer hover:bg-gray-50 overflow-visible fade-in"
                  onClick={() => {
                    setSelectedInvoice(invoice)
                    setIsOpen(true)
                  }}
                >
                  <td className="px-3 py-4 text-sm text-gray-900 truncate">{invoice.number}</td>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm  text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    <div className="flex-1 truncate hidden sm:block">
                      <h3 className="text-gray-800 text-sm truncate text-left">
                        {invoice.customer?.displayName || invoice.customer?.displayId}
                      </h3>
                    </div>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate max-w-xs">
                    {invoice.customerMemo}
                  </td>
                  <td className="px-3 py-4 text-sm truncate">
                    <div className=" text-gray-800">
                      {createdOrUpdatedAtValue &&
                        new Date(createdOrUpdatedAtValue).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500">
                      {createdOrUpdatedAtValue &&
                        new Date(createdOrUpdatedAtValue).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm truncate">
                    <div className=" text-gray-800">
                      {dueDateValue &&
                        new Date(dueDateValue as unknown as string).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 py-4 font-medium text-gray-900  min-w-md">
                    {invoice.total &&
                      new Intl.NumberFormat(currency, {
                        style: 'currency',
                        currency: currency
                      }).format(invoice.total)}
                  </td>
                  {invoice.status && (
                    <td className="px-3 py-4 text-sm text-gray-500 truncate">
                      <span className="">
                        <Chip
                          size="small"
                          className="uppercase"
                          colorClassName={
                            invoice.status.toString() === 'submitted'
                              ? 'bg-green-100 text-primary-800'
                              : 'bg-red-100 text-red-800'
                          }
                          label={invoice.status.toString()}
                        />
                      </span>
                    </td>
                  )}
                  <td className="py-4 text-center text-sm font-medium"></td>
                </tr>
              )
            })}
            {isLoading &&
              [...new Array(10).keys()]?.map((i: number) => {
                return <InvoicesTableLoadingRow key={i} />
              })}
          </tbody>
        </table>

        {/* Empty State */}
        {!isLoading && invoices && invoices.length === 0 && !error && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentSearch className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices</h3>
          </div>
        )}

        {/* Error State - This will now catch the Payment Required error */}
        {error && !isLoading && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="error-state"
          >
            <HiExclamation className="mx-auto h-10 w-10 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-red-800 dark:text-red-300">
              {/* The `error` from the hook can be complex, so we parse it for the UI */}
              {(error as any)?.message || 'An error occurred'}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {/* Attempt to show a more detailed message */}
              {(error as any)?.detail?.message || JSON.stringify((error as any)?.detail) || ''}
            </p>
            {/* Specific action for Unauthorized or Payment Required errors */}
            {((error as any)?.message?.includes('Unauthorized') ||
              (error as any)?.statusCode === 401 ||
              (error as any)?.statusCode === 402) && (
              <>
                <p className="mt-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                  There might be an issue with the connection's authorization or your subscription.
                </p>
                <Button
                  text="Re-authorize connection"
                  onClick={() => setVaultOpen(true)}
                  variant="primary"
                />
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        {((invoices && invoices.length > 0) || isLoading) && (
          <div className="flex flex-row-reverse py-4 border-gray-200 px-4 border-t">
            {hasNextPage && (
              <Button onClick={nextPage} text="Next" className="ml-2" isLoading={isLoading} />
            )}
            {hasPrevPage && (
              <Button
                onClick={prevPage}
                text="Previous"
                variant="secondary"
                isLoading={isLoading}
              />
            )}
            {isLoading && <Button disabled={true} text="Loading" isLoading={isLoading} />}
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        title={`Invoice ${selectedInvoice?.number}`}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        {selectedInvoice && (
          <InvoiceDetails
            invoice={selectedInvoice}
            onClose={() => {
              setIsOpen(false)
            }}
          />
        )}
      </SlideOver>
    </div>
  )
}

export default InvoicesTable
