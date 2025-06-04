import { Button, useToast } from '@apideck/components'
import type { Expense, ExpenseLineItem } from '@apideck/unify/models/components'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

import Spinner from 'components/Spinner'
import { useExpenses } from 'hooks'
import { HiDotsVertical } from 'react-icons/hi'

interface Props {
  expense: Expense
  onClose: () => void
}

const ExpenseDetails = ({ expense, onClose }: Props) => {
  const currency = expense?.currency?.toString() || 'USD'
  const { deleteExpense } = useExpenses()
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const onDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteExpense(id)
      addToast({
        title: 'Expense deleted',
        type: 'success'
      })
      setIsLoading(false)
      onClose()
    } catch (error: any) {
      addToast({
        title: 'Expense failed to delete',
        description: error?.message || 'An unexpected error occurred',
        type: 'error'
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="pb-6">
        <div className="h-24 bg-gradient bg-gradient-to-r from-red-600 to-red-500 sm:h-20 lg:h-28" />
        <div className="lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6">
          <div>
            <div className="-m-1 flex">
              <div className="inline-flex overflow-hidden rounded-lg border-4 border-white bg-white">
                <img
                  className="h-24 w-24 flex-shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                  src="https://www.iskibris.com/assets/images/placeholder-company.png"
                  alt="expense"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 sm:ml-6 sm:flex-1">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Expense {expense.number}
                </h3>
              </div>
              <p className="text-sm text-gray-500">ID: {expense.id}</p>
            </div>
            <div className="mt-5 flex flex-wrap space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:flex-1"
              >
                View details
              </button>
              <button
                type="button"
                className="inline-flex w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Export
              </button>
              <div className="ml-3 inline-flex sm:ml-0">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    <span className="sr-only">Open options menu</span>
                    {isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <HiDotsVertical className="h-5 w-5" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-4 space-y-2 px-4">
                        <Menu.Item>
                          <Button
                            variant="danger-outline"
                            type="button"
                            isLoading={isLoading}
                            onClick={() => onDelete(expense?.id as string)}
                            className="text-gray-700 block text-sm w-full"
                          >
                            Delete expense
                          </Button>
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
      <div className="px-4 py-5 sm:px-0 sm:py-0">
        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Memo
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              <p>{expense.memo}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Payment Type
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6 truncate">
              <p>{expense.paymentType || 'N/A'}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Total Amount
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              {expense.totalAmount !== undefined &&
                expense.totalAmount !== null &&
                new Intl.NumberFormat(currency, {
                  style: 'currency',
                  currency: currency
                }).format(expense.totalAmount)}
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Transaction Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              {expense.transactionDate &&
                new Date(expense.transactionDate as unknown as string).toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:flex sm:py-5">
            <div className="w-full px-4 sm:px-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-xl font-semibold text-gray-900">Line Items</h3>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-col w-full">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              ID
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Total Amount
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Billable
                            </th>
                          </tr>
                        </thead>
                        <tbody className=" bg-white">
                          {expense.lineItems?.map((lineItem: ExpenseLineItem) => {
                            return (
                              <tr key={lineItem.id} className="border-b border-gray-200">
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                  {lineItem?.id}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900 truncate">
                                  {lineItem?.description}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                                  {lineItem?.totalAmount &&
                                    new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(lineItem?.totalAmount)}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                                  {lineItem?.billable ? 'Yes' : 'No'}
                                </td>
                              </tr>
                            )
                          })}
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
