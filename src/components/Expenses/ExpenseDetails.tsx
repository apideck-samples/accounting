import { useToast } from '@apideck/components'
import type { Expense, ExpenseLineItem } from '@apideck/unify/models/components'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

import FormErrors from 'components/FormErrors'
import Spinner from 'components/Spinner'
import { useExpenses } from 'hooks'
import { HiOutlineDotsVertical, HiOutlineOfficeBuilding, HiOutlineTrash } from 'react-icons/hi'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

interface Props {
  expense: Expense
  onClose: () => void
}

const ExpenseDetails = ({ expense, onClose }: Props) => {
  const currency = expense?.currency?.toString() || 'USD'
  const { deleteExpense } = useExpenses()
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const [deleteErrorIssues, setDeleteErrorIssues] = useState<ParsedFormValidationIssue[] | null>(
    null
  )

  const onDelete = async (id: string) => {
    setIsLoading(true)
    setDeleteErrorIssues(null)
    console.log('[ExpenseDetails] Attempting to delete expense with ID:', id)

    const response = await deleteExpense(id)
    console.log('[ExpenseDetails] Response from deleteExpense hook:', response)
    setIsLoading(false)

    if (response && response.success) {
      addToast({
        title: 'Expense Deleted',
        description: `Expense ${expense.number || id} has been successfully deleted.`,
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
        <div className="h-24 rounded-md bg-gradient bg-gradient-to-r from-red-600 to-red-500 sm:h-20 lg:h-28" />
        <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-15">
          <div>
            <div className="-m-1 flex">
              <div className="inline-flex overflow-hidden rounded-lg border-4 border-white bg-white dark:border-gray-800 dark:bg-gray-700">
                <HiOutlineOfficeBuilding className="h-24 w-24 p-4 text-gray-500 dark:text-gray-400 sm:h-40 sm:w-40 lg:h-48 lg:w-48" />
              </div>
            </div>
          </div>
          <div className="mt-6 sm:ml-6 sm:flex-1">
            <div className="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  Expense {expense.number || 'N/A'}
                </h3>
                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  ID: {expense.id}
                </p>
              </div>
              <div className="mt-4 flex flex-shrink-0 items-center gap-x-3 sm:mt-0 sm:ml-4">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => onDelete(expense.id!)}
                              disabled={isLoading}
                              className={`${
                                active
                                  ? 'bg-red-100 text-red-700 dark:bg-red-600 dark:text-red-50'
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
                              {isLoading ? 'Deleting...' : 'Delete Expense'}
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
          <FormErrors issues={deleteErrorIssues} title="Could not delete expense:" />
        </div>
      )}
      <div className="px-4 py-5 sm:px-6 sm:py-0">
        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200 dark:divide-gray-700">
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Memo
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6">
              <p>{expense.memo || 'N/A'}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Payment Type
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6 truncate">
              <p>{expense.paymentType || 'N/A'}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Total Amount
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6">
              {expense.totalAmount !== undefined &&
                expense.totalAmount !== null &&
                new Intl.NumberFormat(currency, {
                  style: 'currency',
                  currency: currency
                }).format(expense.totalAmount)}
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Transaction Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0 sm:ml-6">
              {expense.transactionDate &&
                new Date(expense.transactionDate as unknown as string).toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:flex sm:py-5">
            <div className="w-full px-4 sm:px-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Line Items
                  </h3>
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
                              Description
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              Total Amount
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              Billable
                            </th>
                          </tr>
                        </thead>
                        <tbody className=" bg-white dark:bg-gray-900">
                          {expense.lineItems?.map((lineItem: ExpenseLineItem) => {
                            return (
                              <tr
                                key={lineItem.id || Math.random()}
                                className="border-b border-gray-200 dark:border-gray-700"
                              >
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-400 sm:pl-6">
                                  {lineItem?.id || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {lineItem?.description || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {lineItem?.totalAmount !== undefined &&
                                    lineItem?.totalAmount !== null &&
                                    new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(lineItem?.totalAmount)}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {lineItem?.billable ? 'Yes' : 'No'}
                                </td>
                              </tr>
                            )
                          })}
                          {!expense.lineItems ||
                            (expense.lineItems.length === 0 && (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400"
                                >
                                  No line items for this expense.
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

export default ExpenseDetails
