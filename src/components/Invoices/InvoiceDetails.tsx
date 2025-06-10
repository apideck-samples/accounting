import { Button, useToast } from '@apideck/components'
import type { Invoice, InvoiceLineItem } from '@apideck/unify/models/components'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

import FormErrors from 'components/FormErrors'
import Spinner from 'components/Spinner'
import { useInvoices } from 'hooks'
import { HiOutlineDotsVertical, HiOutlineOfficeBuilding, HiOutlineTrash } from 'react-icons/hi'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

interface Props {
  invoice: Invoice
  onClose: () => void
}

const InvoiceDetails = ({ invoice, onClose }: Props) => {
  const currency = invoice?.currency?.toString() || 'USD'
  const { deleteInvoice } = useInvoices()
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const [deleteErrorIssues, setDeleteErrorIssues] = useState<ParsedFormValidationIssue[] | null>(
    null
  )

  const onDelete = async (id: string) => {
    setIsLoading(true)
    setDeleteErrorIssues(null)

    const response = await deleteInvoice(id)
    setIsLoading(false)

    if (response && response.success) {
      addToast({
        title: 'Invoice Deleted',
        description: `Invoice ${invoice.number || id} has been successfully deleted.`,
        type: 'success'
      })
      onClose()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Deletion Failed'
      )
      addToast({ title: toastTitle, description: toastDescription, type: 'error' })
      if (formIssues.length > 0) {
        setDeleteErrorIssues(formIssues)
      }
    } else {
      addToast({
        title: 'Deletion Failed',
        description: 'An unexpected error occurred and the response was not recognized.',
        type: 'error'
      })
    }
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pb-6">
        <div className="h-24 bg-gradient bg-gradient-to-r from-primary-600 to-primary-500 sm:h-20 lg:h-28" />
        <div className="lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-8">
          <div>
            <div className="-m-1 flex">
              <div className="inline-flex overflow-hidden rounded-lg border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700">
                <HiOutlineOfficeBuilding className="h-24 w-24 text-gray-500 dark:text-gray-400 p-4 sm:h-32 sm:w-32 lg:h-40 lg:w-40 p-4" />
              </div>
            </div>
          </div>
          <div className="mt-6 sm:ml-6 sm:flex-1">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {invoice.customer?.displayName || 'N/A'}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invoice: {invoice.number || invoice.id}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                text="View Customer"
                variant="outline"
                className="sm:flex-1 dark:text-gray-200 dark:border-gray-600"
                onClick={() => console.log('View customer clicked')}
              />
              <Button
                text="Download PDF"
                className="sm:flex-1"
                onClick={() => console.log('Download PDF clicked')}
              />
              <div className="ml-auto inline-flex sm:ml-0">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm font-medium text-gray-400 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open options menu</span>
                    {isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <HiOutlineDotsVertical className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => invoice.id && onDelete(invoice.id)}
                              disabled={isLoading || !invoice.id}
                              className={`${
                                active
                                  ? 'bg-red-100 dark:bg-red-600 text-red-700 dark:text-red-50'
                                  : 'text-red-600 dark:text-red-300'
                              } group flex w-full items-center px-4 py-2 text-sm`}
                            >
                              {isLoading ? (
                                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <HiOutlineTrash
                                  className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
                                  aria-hidden="true"
                                />
                              )}
                              {isLoading ? 'Deleting...' : 'Delete Invoice'}
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {deleteErrorIssues && deleteErrorIssues.length > 0 && (
        <div className="px-4 pt-2 sm:px-6">
          <FormErrors issues={deleteErrorIssues} title="Could not delete invoice:" />
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 sm:py-0">
        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200 dark:divide-gray-700">
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Customer Memo
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6">
              <p>{invoice.customerMemo || 'N/A'}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6 truncate">
              <p>{invoice.billingAddress?.string || 'N/A'}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Balance
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6">
              {invoice.balance !== undefined &&
                invoice.balance !== null &&
                new Intl.NumberFormat(currency, {
                  style: 'currency',
                  currency: currency
                }).format(invoice.balance)}
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Due date
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6">
              {invoice.dueDate &&
                new Date(invoice.dueDate as unknown as string).toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:flex sm:py-5">
            <div className="w-full px-4 sm:px-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Items</h3>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-col w-full">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6">
                    <div className="overflow-hidden shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                            >
                              ID
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              Name/Desc.
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900">
                          {invoice.lineItems?.map((lineItem: InvoiceLineItem, i: number) => {
                            const isSummaryLine =
                              lineItem.type === 'discount' ||
                              lineItem.type === 'info' ||
                              lineItem.type === 'sub_total'

                            if (isSummaryLine) {
                              const label =
                                lineItem.type === 'discount'
                                  ? 'Discount'
                                  : lineItem.type === 'info'
                                  ? 'Info'
                                  : 'Sub total'
                              return (
                                <tr
                                  key={lineItem.id || `non-sales-${i}`}
                                  className="bg-gray-50 dark:bg-gray-800"
                                >
                                  <td
                                    colSpan={4}
                                    className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 dark:text-white font-medium text-right pr-3"
                                  >
                                    {label}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 dark:text-white font-medium">
                                    {new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(lineItem?.totalAmount as number)}
                                  </td>
                                </tr>
                              )
                            }
                            const pricePerUnit =
                              lineItem?.unitPrice ||
                              (lineItem?.quantity === 1 ? lineItem?.totalAmount : undefined)
                            return (
                              <tr
                                key={lineItem.id || `sales-${i}`}
                                className="border-b border-gray-200 dark:border-gray-700"
                              >
                                <td className="whitespace-nowrap truncate max-w-28 py-2 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-400 sm:pl-6">
                                  {lineItem?.item?.id || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap truncate max-w-64 px-2 py-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {lineItem?.item?.name || lineItem?.description || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {lineItem?.quantity}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {pricePerUnit !== undefined &&
                                    pricePerUnit !== null &&
                                    new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(pricePerUnit)}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {lineItem?.totalAmount !== undefined &&
                                    lineItem?.totalAmount !== null &&
                                    new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(lineItem?.totalAmount)}
                                </td>
                              </tr>
                            )
                          })}
                          {!invoice.lineItems ||
                            (invoice.lineItems.length === 0 && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400"
                                >
                                  No line items for this invoice.
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default InvoiceDetails
