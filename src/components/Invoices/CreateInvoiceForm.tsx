import {
  Button,
  DateInput,
  Dropdown,
  TextArea,
  TextInput,
  useModal,
  useToast
} from '@apideck/components'
import {
  Currency,
  Invoice,
  InvoiceItem,
  InvoiceLineItem,
  LinkedCustomer
} from '@apideck/unify/models/components'
import { useCustomers, useInvoices } from 'hooks'
import { useMemo, useState } from 'react'

import { useInvoiceItems } from 'hooks/useInvoiceItems'
import { HiPlus } from 'react-icons/hi'
import LineItems from './LineItems'
import SelectInvoiceItems from './SelectInvoiceItems'

interface CustomerDropdownOption {
  value: string
  label: string
}

const CreateInvoiceForm = ({
  closeForm,
  openCustomerForm,
  openInvoiceItemsForm
}: {
  closeForm: any
  openCustomerForm: any
  openInvoiceItemsForm: any
}) => {
  const { addModal, removeModal } = useModal()
  const { createInvoice } = useInvoices()
  const { invoiceItems } = useInvoiceItems()
  const { customers } = useCustomers()
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([])
  const [customer, setCustomer] = useState<LinkedCustomer | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState<string>()
  const [customerMemo, setCustomerMemo] = useState<string>()
  const [dueDate, setDueDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToast()

  const onInvoiceItemSelect = (invoiceItem: InvoiceItem) => {
    const newLineItem: InvoiceLineItem = {
      item: { id: invoiceItem.id, code: invoiceItem.code, name: invoiceItem.name },
      description: invoiceItem.description,
      quantity: 1,
      unitPrice: invoiceItem.unitPrice,
      type: 'sales_item',
      totalAmount: invoiceItem.unitPrice
    }
    setLineItems([...lineItems, newLineItem])
    removeModal()
  }

  const onLineItemRemove = (lineItem: InvoiceLineItem) => {
    setLineItems(lineItems.filter((li: InvoiceLineItem) => li && li.item?.id !== lineItem.item?.id))
  }

  const onCustomerSelect = (option: CustomerDropdownOption) => {
    setCustomer({ id: option.value, displayName: option.label })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const dueDateString = dueDate ? dueDate.toISOString().split('T')[0] : undefined

    const invoiceToCreate = {
      number: invoiceNumber,
      customerMemo: customerMemo,
      dueDate: dueDateString as string | undefined,
      customer: customer,
      lineItems: lineItems,
      currency: 'USD' as Currency
    }

    const response = await createInvoice(invoiceToCreate as Omit<Invoice, 'id'>)
    setIsLoading(false)

    if (response && (response as any).id) {
      addToast({
        title: 'New Invoice created',
        description: `ID: ${(response as any).id}`,
        type: 'success'
      })
      closeForm()
      return
    }
    if (response && (response as any).message) {
      addToast({
        title: 'Error creating invoice',
        description: (response as any).message,
        type: 'error'
      })
    } else {
      addToast({
        title: 'Error creating invoice',
        description: 'An unknown error occurred.',
        type: 'error'
      })
    }
  }

  const customerOptions: CustomerDropdownOption[] = useMemo(
    () =>
      customers
        ?.map((cust: LinkedCustomer) => {
          if (!cust.id) return null
          return {
            value: cust.id,
            label: cust.displayName || cust.id || 'Unnamed Customer'
          }
        })
        .filter(
          (opt: { value: string; label: string } | null): opt is CustomerDropdownOption =>
            opt !== null && typeof opt.value === 'string' && typeof opt.label === 'string'
        ) || [],
    [customers]
  )

  return (
    <form
      className="flex h-full flex-col overflow-y-auto bg-white justify-between border-t"
      onSubmit={onSubmit}
    >
      <div className="flex-1">
        {/* Divider container */}
        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
          {/* Customer */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Customer</h3>
            </div>
            <div className="sm:col-span-2">
              <div className="flex space-x-2">
                <Dropdown
                  buttonLabel={customer?.displayName || 'Select Customer'}
                  key={'customer'}
                  align={'left'}
                  className="!z-20 text-left"
                  buttonClassName="whitespace-nowrap !text-gray-700 !font-normal"
                  onSelect={onCustomerSelect as (option: any) => void}
                  isScrollable={true}
                  isSearchable={true}
                  onClear={() => setCustomer(null)}
                  minWidth={224}
                  options={customerOptions}
                />

                <button
                  type="button"
                  onClick={openCustomerForm}
                  className="inline-flex mt-1 h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Add customer</span>
                  <HiPlus className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Number */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="invoice-number"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Invoice number
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextInput
                name="invoiceNumber"
                id="invoiceNumber"
                placeholder="Leave blank to auto-generate"
                onChange={(e) => setInvoiceNumber(e.currentTarget.value)}
                className="block"
              />
            </div>
          </div>

          {/* Project description */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="customerMemo"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Memo
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextArea
                id="customerMemo"
                name="customerMemo"
                className="block"
                defaultValue={''}
                onChange={(e) => setCustomerMemo(e.currentTarget.value)}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Due date</h3>
            </div>
            <div className="sm:col-span-2">
              <div className="flex space-x-2">
                <DateInput
                  name="dueDate"
                  type="date"
                  onChange={(e: any) =>
                    setDueDate(e.target?.value ? new Date(e.target.value) : undefined)
                  }
                  placeholder="Select Due Date"
                  minDate={new Date()}
                  onClear={() => setDueDate(undefined)}
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <legend className="sr-only">Privacy</legend>
            <div className="text-sm font-medium text-gray-900" aria-hidden="true">
              Status
            </div>
            <div className="space-y-5 sm:col-span-2">
              <div className="space-y-5 sm:mt-0">
                <div className="relative flex items-start">
                  <div className="absolute flex h-5 items-center">
                    <input
                      id="public-access"
                      name="privacy"
                      aria-describedby="public-access-description"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      defaultChecked
                    />
                  </div>
                  <div className="pl-7 text-sm">
                    <label htmlFor="public-access" className="font-medium text-gray-900">
                      Draft
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="absolute flex h-5 items-center">
                    <input
                      id="restricted-access"
                      name="privacy"
                      aria-describedby="restricted-access-description"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="pl-7 text-sm">
                    <label htmlFor="restricted-access" className="font-medium text-gray-900">
                      Submitted
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="absolute flex h-5 items-center">
                    <input
                      id="private-access"
                      name="privacy"
                      aria-describedby="private-access-description"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="pl-7 text-sm">
                    <label htmlFor="private-access" className="font-medium text-gray-900">
                      Authorised
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Line items */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div className="mb-3">
              <label htmlFor="line_items_label" className="block text-sm font-medium text-gray-900">
                Items
              </label>

              {lineItems?.length > 0 && (
                <LineItems
                  invoice={{ lineItems: lineItems } as Partial<Invoice>}
                  onRemove={onLineItemRemove}
                />
              )}
            </div>

            {lineItems?.length === 0 ? (
              <div className="text-center border-b pb-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
                <p className="mt-1 text-sm text-gray-500">Start adding items to this invoice.</p>
                <div className="mt-6 flex items-center justify-center">
                  <Button
                    type="button"
                    className="inline-flex"
                    onClick={() =>
                      addModal(
                        <SelectInvoiceItems
                          invoiceItems={invoiceItems}
                          onSelect={onInvoiceItemSelect}
                        />,
                        {
                          style: { maxWidth: 420 }
                        }
                      )
                    }
                  >
                    Select Item
                  </Button>
                  <button
                    type="button"
                    onClick={openInvoiceItemsForm}
                    className="ml-2 inline-flex mt-1 h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Add customer</span>
                    <HiPlus className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <Button
                text="Add item"
                onClick={() =>
                  addModal(
                    <SelectInvoiceItems
                      invoiceItems={invoiceItems}
                      onSelect={onInvoiceItemSelect}
                    />,
                    {
                      style: { maxWidth: 420 }
                    }
                  )
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={closeForm}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateInvoiceForm
