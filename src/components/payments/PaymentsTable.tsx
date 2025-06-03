import { Button } from '@apideck/components'
import type { Payment } from '@apideck/unify/models/components'
import { usePayments } from 'hooks/usePayments'
import { HiOutlineDocumentSearch } from 'react-icons/hi'
import PaymentsTableLoadingRow from './PaymentsTableLoadingRow'

const PaymentsTable = () => {
  const { payments, isLoading, hasNextPage, hasPrevPage, nextPage, prevPage } = usePayments()

  return (
    <div className="sm:px-4 md:px-0">
      <div className="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 sm:rounded-lg fade-up">
        {/* Payments Table */}
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Payment ID
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Company
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Reference
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Transaction Date
              </th>
              {/* Check for status property existence more safely */}
              {payments && payments.length > 0 && payments[0]?.status !== undefined && (
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
              )}
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Total amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {payments?.map((payment: Payment) => {
              const currency = payment.currency?.toString() ?? 'USD' // Ensure currency is string

              return (
                <tr key={payment.id}>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                    {payment?.id}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                    {/* Use camelCase for customer properties */}
                    {payment?.customer?.companyName ||
                      payment?.customer?.displayName ||
                      payment?.customer?.id}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {payment?.reference}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {/* Use camelCase: transactionDate (it's a Date object) */}
                    {payment?.transactionDate &&
                      new Date(payment.transactionDate).toLocaleDateString()}
                  </td>
                  {/* Ensure status is checked before rendering the cell */}
                  {payment.status !== undefined && (
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 capitalize">
                      {payment?.status?.toString()} {/* status is an enum, convert to string */}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {/* Use camelCase: totalAmount */}
                    {payment?.totalAmount !== null &&
                      payment?.totalAmount !== undefined &&
                      new Intl.NumberFormat(currency, {
                        style: 'currency',
                        currency: currency
                      }).format(payment?.totalAmount)}
                  </td>
                </tr>
              )
            })}
            {isLoading &&
              [...new Array(20).keys()]?.map((i: number) => {
                return <PaymentsTableLoadingRow key={i} />
              })}
          </tbody>
        </table>

        {/* Ensure payments is checked before accessing length */}
        {payments && payments.length === 0 && !isLoading && (
          <div
            className="text-center bg-white py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentSearch className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments</h3>
          </div>
        )}

        {/* Ensure payments is checked before accessing length */}
        {((payments && payments.length > 0) || isLoading) && (
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
    </div>
  )
}

export default PaymentsTable
