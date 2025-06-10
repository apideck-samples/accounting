import { Button, DateInput, Dropdown, TextArea, TextInput, useToast } from '@apideck/components'
import { Currency, PurchaseOrderStatus } from '@apideck/unify/models/components'
import FormErrors from 'components/FormErrors'
import { usePurchaseOrders, useSuppliers } from 'hooks'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

interface DropdownOption {
  value: string
  label: string
}

interface FormLineItem {
  description: string
  totalAmount: number
  quantity: number
  unitPrice: number
}

const CreatePurchaseOrderForm = ({ closeForm }: { closeForm: any }) => {
  const { createPurchaseOrder } = usePurchaseOrders()
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers()

  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)
  const [poNumber, setPoNumber] = useState<string>('')
  const [issuedDate, setIssuedDate] = useState<Date>(new Date())
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined)
  const [memo, setMemo] = useState<string>('')
  const [status, setStatus] = useState<PurchaseOrderStatus>(PurchaseOrderStatus.Open)
  const [currency, setCurrency] = useState<Currency>(Currency.Usd)
  const [lineItems, setLineItems] = useState<FormLineItem[]>([])

  const [lineItemDesc, setLineItemDesc] = useState<string>('')
  const [lineItemAmount, setLineItemAmount] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formValidationIssues, setFormValidationIssues] = useState<
    ParsedFormValidationIssue[] | null
  >(null)
  const { addToast } = useToast()

  const handleAddLineItem = () => {
    if (!lineItemAmount || !lineItemDesc) return
    const newLine: FormLineItem = {
      description: lineItemDesc,
      totalAmount: lineItemAmount,
      quantity: 1,
      unitPrice: lineItemAmount
    }
    setLineItems((prev) => [...prev, newLine])
    setLineItemDesc('')
    setLineItemAmount(0)
  }

  const onSupplierSelect = (option: any) => {
    if (option && typeof option.value === 'string') {
      setSelectedSupplierId(option.value)
    }
  }

  const onStatusSelect = (option: any) => {
    if (
      option &&
      typeof option.value === 'string' &&
      Object.values(PurchaseOrderStatus).includes(option.value as PurchaseOrderStatus)
    ) {
      setStatus(option.value as PurchaseOrderStatus)
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormValidationIssues(null)

    const purchaseOrderToCreate = {
      supplier: selectedSupplierId ? { id: selectedSupplierId } : undefined,
      poNumber: poNumber || undefined,
      issuedDate: issuedDate,
      deliveryDate: deliveryDate,
      memo: memo || undefined,
      status: status,
      currency: currency,
      lineItems: lineItems.length > 0 ? lineItems : undefined
    }

    const response = await createPurchaseOrder(purchaseOrderToCreate)
    setIsLoading(false)

    const createdData = response?.createPurchaseOrderResponse?.data
    if (createdData && createdData.id && !response.error) {
      addToast({ title: 'Purchase Order created successfully', type: 'success' })
      closeForm()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Purchase Order Creation Failed',
        'purchaseOrder'
      )
      addToast({ title: toastTitle, description: toastDescription, type: 'error' })
      if (formIssues.length > 0) {
        setFormValidationIssues(formIssues)
      }
    } else {
      const genericErrorDetails = response
        ? parseApiResponseError(response, 'Purchase Order Creation Failed', 'purchaseOrder')
        : parseApiResponseError(null, 'Purchase Order Creation Failed')
      addToast({
        title: genericErrorDetails.toastTitle,
        description: genericErrorDetails.toastDescription,
        type: 'error'
      })
      if (genericErrorDetails.formIssues.length > 0) {
        setFormValidationIssues(genericErrorDetails.formIssues)
      }
    }
  }

  const supplierOptions: DropdownOption[] = useMemo(() => {
    if (isLoadingSuppliers || !suppliers) return []
    return suppliers
      .filter((s) => s.id)
      .map((s) => ({
        value: s.id as string,
        label: s.displayName || s.companyName || (s.id as string)
      }))
  }, [suppliers, isLoadingSuppliers])

  const statusOptions = useMemo(
    () =>
      Object.values(PurchaseOrderStatus).map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s
      })),
    []
  )

  const currencyOptions = useMemo(
    () => Object.values(Currency).map((c) => ({ label: c, value: c })),
    []
  )

  const totalAmount = useMemo(
    () => lineItems.reduce((acc, item) => acc + (item.totalAmount || 0), 0),
    [lineItems]
  )

  return (
    <form
      className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 justify-between border-t dark:border-gray-700"
      onSubmit={onSubmit}
    >
      <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
        <FormErrors issues={formValidationIssues} />

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Supplier
            </label>
            <Dropdown
              buttonLabel={
                suppliers?.find((s) => s.id === selectedSupplierId)?.displayName ||
                (isLoadingSuppliers
                  ? 'Loading...'
                  : supplierOptions.length > 0
                  ? 'Select Supplier'
                  : 'No Suppliers Found')
              }
              options={supplierOptions}
              onSelect={onSupplierSelect}
              onClear={!isLoadingSuppliers ? () => setSelectedSupplierId(null) : undefined}
              isSearchable={!isLoadingSuppliers}
              align="left"
              className="z-30"
            />
          </div>
          <div>
            <label
              htmlFor="poNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              PO Number
            </label>
            <TextInput
              name="poNumber"
              value={poNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPoNumber(e.currentTarget.value)}
              className="mt-1"
              placeholder="e.g. PO-001"
            />
          </div>
          <div>
            <label
              htmlFor="issuedDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Issued Date
            </label>
            <DateInput
              name="issuedDate"
              type="date"
              value={issuedDate?.toISOString().split('T')[0]}
              onChange={(e: any) =>
                setIssuedDate(e.target.value ? new Date(e.target.value) : new Date())
              }
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="deliveryDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delivery Date
            </label>
            <DateInput
              name="deliveryDate"
              type="date"
              value={deliveryDate?.toISOString().split('T')[0]}
              onChange={(e: any) =>
                setDeliveryDate(e.target.value ? new Date(e.target.value) : undefined)
              }
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <Dropdown
              buttonLabel={
                statusOptions.find((opt) => opt.value === status)?.label || 'Select Status'
              }
              options={statusOptions}
              onSelect={onStatusSelect}
              buttonClassName="mt-1 w-full"
              align="left"
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Currency
            </label>
            <Dropdown
              buttonLabel={
                currencyOptions.find((opt) => opt.value === currency)?.label || 'Select Currency'
              }
              options={currencyOptions}
              onSelect={(opt: any) => setCurrency(opt.value as Currency)}
              buttonClassName="mt-1 w-full"
              align="left"
              isSearchable
              isScrollable
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="memo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Memo
          </label>
          <TextArea
            name="memo"
            value={memo}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMemo(e.currentTarget.value)}
            className="mt-1"
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Line Items
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="lineItemDesc"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <TextInput
                name="lineItemDesc"
                value={lineItemDesc}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLineItemDesc(e.currentTarget.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="lineItemAmount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Amount
              </label>
              <TextInput
                name="lineItemAmount"
                type="number"
                value={lineItemAmount.toString()}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLineItemAmount(parseFloat(e.currentTarget.value) || 0)
                }
              />
            </div>
            <div className="sm:col-span-6 text-right">
              <Button text="Add Item" variant="outline" size="small" onClick={handleAddLineItem} />
            </div>
          </div>
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-200 dark:divide-gray-700 border-t border-b dark:border-gray-700"
          >
            {lineItems.map((item, index: number) => (
              <li key={index} className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-800 dark:text-gray-200">{item.description}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(
                    item.totalAmount || 0
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="text-right mt-2 font-bold text-lg text-gray-900 dark:text-white">
            Total:{' '}
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(
              totalAmount
            )}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 border-t dark:border-gray-700 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeForm}
            className="dark:text-white dark:border-gray-600"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading || isLoadingSuppliers}>
            Create Purchase Order
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreatePurchaseOrderForm
