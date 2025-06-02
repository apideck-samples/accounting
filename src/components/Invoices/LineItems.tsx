import type { Invoice, InvoiceLineItem } from '@apideck/unify/models/components'

interface Props {
  invoice: Partial<Invoice>
  onRemove?: (LineItem: InvoiceLineItem) => void
}

const LineItems = ({ invoice, onRemove }: Props) => {
  const currency = invoice?.currency?.toString() || 'USD'

  return (
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
                  {onRemove !== undefined && (
                    <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Remove</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className=" bg-white">
                {invoice.lineItems?.map((lineItem: InvoiceLineItem, i: number) => {
                  if (lineItem?.type && lineItem.type !== 'sales_item') {
                    const label =
                      lineItem.type === 'discount'
                        ? 'Discount'
                        : lineItem.type === 'info'
                        ? 'Info'
                        : lineItem.type === 'sub_total'
                        ? 'Sub total'
                        : ''
                    return (
                      <tr key={lineItem.id || `non-sales-${i}`} className="bg-gray-50">
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
                          }).format(lineItem?.totalAmount as number)}
                        </td>
                      </tr>
                    )
                  }

                  const pricePerUnit =
                    lineItem?.unitPrice ||
                    (lineItem?.quantity === 1 ? lineItem?.totalAmount : undefined)

                  const totalPrice =
                    lineItem?.totalAmount ||
                    (lineItem.quantity && pricePerUnit
                      ? Number(lineItem.quantity) * Number(pricePerUnit)
                      : undefined)

                  return (
                    <tr key={lineItem.id || `sales-${i}`} className="border-b border-gray-200">
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
                        {(pricePerUnit &&
                          new Intl.NumberFormat(currency, {
                            style: 'currency',
                            currency: currency
                          }).format(pricePerUnit)) ||
                          '-'}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                        {(totalPrice &&
                          new Intl.NumberFormat(currency, {
                            style: 'currency',
                            currency: currency
                          }).format(totalPrice)) ||
                          '-'}
                      </td>
                      {onRemove && (
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => onRemove(lineItem)}
                            type="button"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Remove<span className="sr-only">, {lineItem.id}</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}

                {invoice.totalTax !== undefined && invoice.totalTax !== null && (
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
                      }).format(invoice.totalTax)}
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
  )
}

export default LineItems
