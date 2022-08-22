import { Button } from '@apideck/components'
import { HiOutlineDocumentSearch } from 'react-icons/hi'
import { Payment } from '@apideck/node'
import PaymentsTableLoadingRow from 'components/Customers/PaymentsTableLoadingRow'
import { usePayments } from 'hooks/usePayments'

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
                Payment Method
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
              {payments && payments[0]?.status && (
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
              const currency = payment.currency ?? 'USD'

              return (
                <tr key={payment.id}>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                    {payment?.id}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                    {payment?.customer?.company_name || payment?.customer?.id}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                    {payment?.payment_method_reference}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {payment?.reference}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {payment?.transaction_date &&
                      new Date(payment?.transaction_date).toLocaleDateString()}
                  </td>
                  {payment.status && (
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 capitalize">
                      {payment?.status}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {new Intl.NumberFormat(currency, {
                      style: 'currency',
                      currency: currency
                    }).format(payment?.total_amount as any)}
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

        {/* Empty State */}
        {payments?.length === 0 && !isLoading && (
          <div
            className="text-center bg-white py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentSearch className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments</h3>
          </div>
        )}

        {/* Pagination */}
        {(payments?.length > 0 || isLoading) && (
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
