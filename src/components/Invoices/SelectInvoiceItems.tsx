import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { InvoiceItem } from '@apideck/node'
import SearchInput from 'components/SearchInput'
import { useDebounce } from '@apideck/components'

interface Props {
  invoiceItems: InvoiceItem[]
  onSelect: (invoiceItem: InvoiceItem) => void
}

const SelectInvoiceItems = ({ invoiceItems, onSelect }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [list, setList] = useState<InvoiceItem[]>([])
  const debouncedSearchTerm = useDebounce(searchTerm, 250)
  const searchInputRef: any = useRef()

  useEffect(() => {
    if (debouncedSearchTerm) {
      const results = invoiceItems.filter((invoiceItem) =>
        invoiceItem?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )

      setList(results)
    }
    searchInputRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  const items = searchTerm.length ? list : invoiceItems

  return (
    <div className="pb-6">
      <SearchInput
        value={searchTerm}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
        searchInputRef={searchInputRef}
        placeholder="Search for invoice items"
        autoFocus
      />
      <div className="h-[580px] 2xl:h-[620px] overflow-y-auto -mb-12 px-6 -mx-6 border-t border-gray-200 mt-5">
        <ul role="list" className="divide-y divide-gray-200">
          {items?.map((item) => (
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
    </div>
  )
}

export default SelectInvoiceItems
