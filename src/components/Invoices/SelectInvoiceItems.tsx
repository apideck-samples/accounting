import { InvoiceItem } from '@apideck/node'

interface Props {
  invoiceItems: InvoiceItem[]
  onSelect: (invoiceItem: InvoiceItem) => void
}

const SelectInvoiceItems = ({ invoiceItems, onSelect }: Props) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {invoiceItems?.map((item) => (
          <li
            key={item.id}
            className="-mx-6 px-6 py-5 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="relative focus-within:ring-2 focus-within:ring-indigo-500 flex justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  <span className="hover:underline focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.name}
                  </span>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
              </div>
              {item.unit_price !== undefined && item.unit_price !== null && (
                <div className="text-sm mt-1 font-medium">
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'symbol'
                  }).format(item.unit_price)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectInvoiceItems
