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
  Customer,
  Invoice,
  InvoiceItem,
  InvoiceLineItem,
  InvoiceStatus,
  LinkedCustomer
} from '@apideck/unify/models/components'
import { RFCDate } from '@apideck/unify/types'
import FormErrors from 'components/FormErrors'
import { useCustomers, useInvoices } from 'hooks'
import { FormEvent, useMemo, useState } from 'react'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

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
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date>()
  const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.Draft)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()
  const [formValidationIssues, setFormValidationIssues] = useState<
    ParsedFormValidationIssue[] | null
  >(null)

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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormValidationIssues(null)

    const invoiceToCreate = {
      number: invoiceNumber,
      customerMemo: customerMemo,
      invoiceDate: invoiceDate ? new RFCDate(invoiceDate.toISOString().split('T')[0]) : undefined,
      dueDate: dueDate ? new RFCDate(dueDate.toISOString().split('T')[0]) : undefined,
      customer: customer,
      lineItems: lineItems,
      currency: 'USD' as Currency,
      status: status,
      type: 'service'
    }

    const response = await createInvoice(invoiceToCreate as Omit<Invoice, 'id'>)
    setIsLoading(false)

    const createdInvoiceData = response?.createInvoiceResponse?.data

    if (createdInvoiceData && createdInvoiceData.id && !response.error) {
      addToast({
        title: 'New Invoice Created',
        description: `Invoice ${
          createdInvoiceData.number || createdInvoiceData.id
        } successfully created.`,
        type: 'success'
      })
      closeForm()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Invoice Creation Failed'
      )
      addToast({ title: toastTitle, description: toastDescription, type: 'error' })
      if (formIssues.length > 0) {
        setFormValidationIssues(formIssues)
      }
    } else {
      const genericErrorDetails = response
        ? parseApiResponseError(response, 'Invoice Creation Failed')
        : parseApiResponseError(null, 'Invoice Creation Failed')
      addToast({
        title: genericErrorDetails.toastTitle,
        description: genericErrorDetails.toastDescription,
        type: 'error'
      })
      if (genericErrorDetails.formIssues.length > 0) {
        setFormValidationIssues(genericErrorDetails.formIssues)
      } else if (response && typeof response.message === 'string' && !response.error) {
        setFormValidationIssues([{ message: response.message }])
      }
    }
  }

  const customerOptions: CustomerDropdownOption[] = useMemo(
    () =>
      customers
        ?.filter((cust): cust is Customer & { id: string } => !!cust.id)
        .map((cust: Customer) => {
          return {
            value: cust.id,
            label:
              cust.displayName ||
              (cust.firstName && cust.lastName
                ? `${cust.firstName} ${cust.lastName}`
                : cust.companyName || cust.id || 'Unnamed Customer')
          }
        }) || [],
    [customers]
  )

  const statusOptions = Object.values(InvoiceStatus).map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' '),
    value: s
  }))

  const getFieldError = (fieldPathKey: string): string | undefined => {
    if (!formValidationIssues) return undefined
    const fieldError = formValidationIssues.find(
      (issue) => issue.path && issue.path.join('.') === fieldPathKey
    )
    return fieldError?.message
  }

  return (
    <form
      className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 justify-between border-t dark:border-gray-700"
      onSubmit={onSubmit}
    >
      <div className="flex-1">
        <div className="px-4 sm:px-6 pt-4">
          <FormErrors issues={formValidationIssues} />
        </div>

        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 dark:divide-gray-600 sm:py-0">
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Customer</h3>
            </div>
            <div className="sm:col-span-2">
              <div className="flex space-x-2">
                <Dropdown
                  buttonLabel={customer?.displayName || 'Select Customer'}
                  options={customerOptions}
                  onSelect={onCustomerSelect as (option: any) => void}
                  onClear={() => setCustomer(null)}
                  isSearchable={true}
                  isScrollable={true}
                  minWidth={224}
                  align={'left'}
                  className="!z-30 text-left"
                  buttonClassName="w-full text-left !text-gray-700 dark:!text-gray-300 !font-normal"
                />
                <button
                  type="button"
                  onClick={openCustomerForm}
                  className="inline-flex mt-1 h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Add customer</span>
                  <HiPlus className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {getFieldError('invoice.customer') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.customer')}</p>
              )}
              {getFieldError('invoice.customer.id') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.customer.id')}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="invoice-number"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 sm:mt-px sm:pt-2"
              >
                Invoice number
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextInput
                name="invoiceNumber"
                id="invoiceNumber"
                placeholder="Leave blank to auto-generate"
                value={invoiceNumber || ''}
                onChange={(e) => setInvoiceNumber(e.currentTarget.value)}
                className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {getFieldError('invoice.number') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.number')}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="customerMemo"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 sm:mt-px sm:pt-2"
              >
                Memo
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextArea
                id="customerMemo"
                name="customerMemo"
                className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={customerMemo || ''}
                onChange={(e) => setCustomerMemo(e.currentTarget.value)}
              />
              {getFieldError('invoice.customerMemo') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.customerMemo')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Invoice Date</h3>
            </div>
            <div className="sm:col-span-2">
              <DateInput
                name="invoiceDate"
                type="date"
                value={invoiceDate ? invoiceDate.toISOString().split('T')[0] : undefined}
                onChange={(e: any) =>
                  setInvoiceDate(e.target?.value ? new Date(e.target.value) : new Date())
                }
                onClear={() => setInvoiceDate(new Date())}
                placeholder="Select Invoice Date"
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                containerClassName="w-full !z-40"
              />
              {getFieldError('invoice.invoiceDate') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.invoiceDate')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Due date</h3>
            </div>
            <div className="sm:col-span-2">
              <div className="flex space-x-2">
                <DateInput
                  name="dueDate"
                  type="date"
                  value={dueDate ? dueDate.toISOString().split('T')[0] : undefined}
                  onChange={(e: any) =>
                    setDueDate(e.target?.value ? new Date(e.target.value) : undefined)
                  }
                  placeholder="Select Due Date"
                  minDate={invoiceDate || new Date()}
                  onClear={() => setDueDate(undefined)}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  containerClassName="w-full !z-30"
                />
              </div>
              {getFieldError('invoice.dueDate') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.dueDate')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Status</h3>
            </div>
            <div className="sm:col-span-2">
              <Dropdown
                buttonLabel={
                  statusOptions.find((opt) => opt.value === status)?.label || 'Select Status'
                }
                options={statusOptions}
                onSelect={(option) => setStatus(option.value as InvoiceStatus)}
                align="left"
                buttonClassName="w-full text-left !text-gray-700 dark:!text-gray-300 !font-normal"
                className="!z-10"
              />
              {getFieldError('invoice.status') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.status')}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 px-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div className="mb-3 flex justify-between items-center">
              <label
                htmlFor="line_items_label"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Items
              </label>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
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
                  className="dark:text-gray-200 dark:border-gray-600"
                >
                  Select Item
                </Button>
                <button
                  type="button"
                  onClick={openInvoiceItemsForm}
                  className="ml-2 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Add new item</span>
                  <HiPlus className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            {getFieldError('invoice.lineItems') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.lineItems')}</p>
            )}
            {getFieldError('invoice.line_items') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('invoice.line_items')}</p>
            )}

            {lineItems?.length > 0 ? (
              <LineItems
                invoice={{ lineItems: lineItems } as Partial<Invoice>}
                onRemove={onLineItemRemove}
              />
            ) : (
              <div className="text-center border-b dark:border-gray-700 pb-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  No items
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start adding items to this invoice.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeForm}
            className="dark:text-gray-200 dark:border-gray-600"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Invoice
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateInvoiceForm
