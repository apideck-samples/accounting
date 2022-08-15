import type { Invoice, InvoiceLineItem } from '@apideck/node'
import { Menu, Transition } from '@headlessui/react'

import { Fragment } from 'react'
import { HiDotsVertical } from 'react-icons/hi'

interface Props {
  invoice: Invoice
}

const InvoiceDetails = ({ invoice }: Props) => {
  const currency = invoice?.currency || 'USD'

  console.log('invocie', invoice)

  return (
    <div className="divide-y divide-gray-200">
      <div className="pb-6">
        <div className="h-24 bg-gradient bg-gradient-to-r from-primary-600 to-primary-500 sm:h-20 lg:h-28" />
        <div className="lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6">
          <div>
            <div className="-m-1 flex">
              <div className="inline-flex overflow-hidden rounded-lg border-4 border-white bg-white">
                <img
                  className="h-24 w-24 flex-shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                  src="https://www.iskibris.com/assets/images/placeholder-company.png"
                  alt="customer"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 sm:ml-6 sm:flex-1">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {invoice.customer?.display_name}
                </h3>
              </div>
              <p className="text-sm text-gray-500">Customer ID: {invoice.customer?.id}</p>
            </div>
            <div className="mt-5 flex flex-wrap space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:flex-1"
              >
                View details
              </button>
              <button
                type="button"
                className="inline-flex w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Call
              </button>
              <div className="ml-3 inline-flex sm:ml-0">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open options menu</span>
                    <HiDotsVertical className="h-5 w-5" aria-hidden="true" />
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
                      <div className="py-1">
                        <Menu.Item>
                          <a href="#" className="text-gray-700 block px-4 py-2 text-sm">
                            Update invoice
                          </a>
                        </Menu.Item>
                        <Menu.Item>
                          <a href="#" className="text-gray-700 block px-4 py-2 text-sm">
                            Delete invoice
                          </a>
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
              Customer Memo
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              <p>{invoice.customer_memo}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6 truncate">
              <p>{invoice.billing_address?.string}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Balance
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              {invoice.balance !== undefined &&
                invoice.balance !== null &&
                new Intl.NumberFormat(currency, {
                  style: 'currency',
                  currency: currency
                }).format(invoice.balance)}
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Due date
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              {invoice.due_date && new Date(invoice.due_date).toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:flex sm:py-5">
            <div className="w-full px-4 sm:px-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-xl font-semibold text-gray-900">Items</h3>
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
                              Name
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className=" bg-white">
                          {invoice.line_items?.map((lineItem: InvoiceLineItem) => {
                            if (lineItem.type !== 'sales_item') {
                              const label =
                                lineItem.type === 'discount'
                                  ? 'Discount'
                                  : lineItem.type === 'info'
                                  ? 'Info'
                                  : lineItem.type === 'sub_total'
                                  ? 'Sub total'
                                  : ''
                              return (
                                <tr key={lineItem.id} className="bg-gray-50">
                                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"></td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900"></td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 font-medium text-right">
                                    {label}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 font-medium">
                                    {new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(lineItem?.total_amount as any)}
                                  </td>
                                </tr>
                              )
                            }

                            const pricePerUnit =
                              lineItem?.unit_price ||
                              (lineItem?.quantity === 1 ? lineItem?.total_amount : '')
                            return (
                              <tr key={lineItem.id} className="border-b border-gray-200">
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                  {lineItem?.item?.id}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900 truncate">
                                  {lineItem?.item?.name || lineItem?.description}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                                  {lineItem?.quantity}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                                  {pricePerUnit &&
                                    new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(pricePerUnit)}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                                  {lineItem?.total_amount &&
                                    new Intl.NumberFormat(currency, {
                                      style: 'currency',
                                      currency: currency
                                    }).format(lineItem?.total_amount)}
                                </td>
                              </tr>
                            )
                          })}

                          {invoice.total_tax !== undefined && invoice.total_tax !== null && (
                            <tr className=" bg-gray-50">
                              <td className="whitespace-nowrap pb-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"></td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm font-medium text-gray-900"></td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm text-gray-500"></td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm text-gray-900 font-medium text-right">
                                Tax
                              </td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm text-gray-900 font-medium">
                                {new Intl.NumberFormat(currency, {
                                  style: 'currency',
                                  currency: currency
                                }).format(invoice.total_tax)}
                              </td>
                            </tr>
                          )}

                          {invoice.total !== undefined && invoice.total !== null && (
                            <tr className=" bg-gray-50">
                              <td className="whitespace-nowrap pb-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"></td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm font-medium text-gray-900"></td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm text-gray-500"></td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm text-gray-900 font-medium text-right">
                                Total
                              </td>
                              <td className="whitespace-nowrap px-2 pb-2 text-sm text-gray-900 font-medium">
                                {new Intl.NumberFormat(currency, {
                                  style: 'currency',
                                  currency: currency
                                }).format(invoice.total)}
                              </td>
                            </tr>
                          )}
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
