import { Chip } from '@apideck/components'
import { HiOutlineDocumentSearch } from 'react-icons/hi'
import InvoicesTableLoadingRow from './InvoicesTableLoadingRow'
import { Waypoint } from 'react-waypoint'
import { useInvoices } from 'hooks'

const InvoicesTable = () => {
  const { invoices, isLoading, hasNextPage } = useInvoices()

  return (
    <div className="sm:px-4 md:px-0">
      <div className="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 sm:rounded-lg fade-up">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
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
                {invoices?.length > 0 && invoices[0].created_at ? 'Created at' : 'Updated at'}
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                Due Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                Total
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 ">
                <span className="whitespace-nowrap">Number</span>
              </th>
              {invoices?.length > 0 && invoices[0].status && (
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 "
                >
                  <span className="whitespace-nowrap">Status</span>
                </th>
              )}
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-sm font-medium text-gray-900"
              >
                {isLoading && (
                  <span className="w-full flex justify-end">
                    <svg
                      data-testid="spinner"
                      className="animate-spin h-4 w-4 text-ui-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {invoices?.map((invoice: any) => {
              const currency = invoice?.currency || 'USD'
              const createdOrUpdatedAt = invoice.created_at || invoice.updated_at

              return (
                <tr
                  key={invoice.id}
                  className="cursor-pointer hover:bg-gray-50 overflow-visible fade-in"
                  onClick={() => {
                    console.log('invoice clicked: ', invoice.id)
                  }}
                >
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm  text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    <div className="flex-1 truncate hidden sm:block">
                      <h3 className="text-gray-800 text-sm truncate text-left">
                        {invoice.customer?.display_name || invoice.customer?.display_id}
                      </h3>
                    </div>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate max-w-xs">
                    {invoice.customer_memo}
                  </td>
                  <td className="px-3 py-4 text-sm truncate">
                    <div className=" text-gray-800">
                      {new Date(createdOrUpdatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500">
                      {new Date(createdOrUpdatedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm truncate">
                    <div className=" text-gray-800">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 py-4 font-medium text-gray-900  min-w-md">
                    {new Intl.NumberFormat(currency, {
                      style: 'currency',
                      currency: currency
                    }).format(invoice.total)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 truncate">{invoice.number}</td>
                  {invoice.status && (
                    <td className="px-3 py-4 text-sm text-gray-500 truncate">
                      <span className="">
                        <Chip
                          size="small"
                          className="uppercase"
                          colorClassName={
                            invoice.status === 'submitted'
                              ? 'bg-green-100 text-primary-800'
                              : 'bg-red-100 text-red-800'
                          }
                          label={invoice.status}
                        />
                      </span>
                    </td>
                  )}
                  <td className="py-4 text-center text-sm font-medium"></td>
                </tr>
              )
            })}
            {isLoading &&
              [...new Array(15).keys()]?.map((i: number) => {
                return <InvoicesTableLoadingRow key={i} />
              })}
          </tbody>
        </table>

        {invoices?.length === 0 && !isLoading && (
          <div
            className="text-center bg-white py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentSearch className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
            <p className="mt-1 text-sm text-gray-500">Todo</p>
          </div>
        )}

        {invoices?.length && !isLoading && hasNextPage ? (
          <Waypoint onEnter={() => console.log('load more')} />
        ) : null}
      </div>
    </div>
  )
}

export default InvoicesTable
