import { Button, Dropdown, TextArea, TextInput, useToast } from '@apideck/components'
import {
  CreditNoteInput,
  CreditNoteStatus,
  CreditNoteType,
  Currency,
  LinkedCustomer
} from '@apideck/unify/models/components'
import FormErrors from 'components/FormErrors'
import { useCreditNotes, useCustomers } from 'hooks'
import { FormEvent, useEffect, useState } from 'react'
import {
  FormValidationIssue as ParsedFormValidationIssue,
  parseApiResponseError
} from 'utils/errorUtils'

const CreateCreditNoteForm = ({ closeForm }: { closeForm: () => void }) => {
  const { createCreditNote } = useCreditNotes()
  const { customers } = useCustomers()
  const [number, setNumber] = useState<string>('')
  const [customer, setCustomer] = useState<LinkedCustomer | null>(null)
  const [status, setStatus] = useState<CreditNoteStatus>(CreditNoteStatus.Authorised)
  const [type, setType] = useState<CreditNoteType>(CreditNoteType.AccountsReceivableCredit)
  const [lineItems, setLineItems] = useState<any[]>([])
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()
  const [formValidationIssues, setFormValidationIssues] = useState<
    ParsedFormValidationIssue[] | null
  >(null)

  useEffect(() => {
    const total = lineItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
    setCalculatedTotal(total)
  }, [lineItems])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormValidationIssues(null)

    const creditNoteToCreate: CreditNoteInput = {
      number,
      totalAmount: calculatedTotal,
      balance: calculatedTotal,
      customer,
      lineItems,
      currency: Currency.Usd,
      status: status,
      type: type
    }

    const response = await createCreditNote(creditNoteToCreate)
    setIsLoading(false)

    if (response && response.id && !response.error) {
      addToast({ title: 'Credit note created successfully', type: 'success' })
      closeForm()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Credit Note Creation Failed'
      )
      addToast({ title: toastTitle, description: toastDescription, type: 'error' })
      if (formIssues.length > 0) {
        setFormValidationIssues(formIssues)
      }
    } else {
      addToast({
        title: 'Creation Failed',
        description: 'An unexpected error occurred.',
        type: 'error'
      })
    }
  }

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const updatedLineItems = [...lineItems]
    const item = updatedLineItems[index] as any
    item[field] = value

    if (field === 'quantity' || field === 'unitPrice') {
      item.totalAmount = (item.quantity || 0) * (item.unitPrice || 0)
    }

    setLineItems(updatedLineItems)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { totalAmount: 0, quantity: 1, unitPrice: 0 }])
  }

  const removeLineItem = (index: number) => {
    const updatedLineItems = [...lineItems]
    updatedLineItems.splice(index, 1)
    setLineItems(updatedLineItems)
  }

  const statusOptions = Object.values(CreditNoteStatus).map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: s
  }))

  const typeOptions = Object.values(CreditNoteType).map((t) => ({
    label: t
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    value: t
  }))

  return (
    <form
      className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 justify-between border-t dark:border-gray-700"
      onSubmit={onSubmit}
    >
      <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
        <FormErrors issues={formValidationIssues} />

        <div>
          <label
            htmlFor="customer"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Customer
          </label>
          <select
            id="customer"
            name="customer"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
            onChange={(e) => {
              const selectedCustomer = customers?.find((c) => c.id === e.target.value) || null
              setCustomer(
                selectedCustomer
                  ? {
                      id: selectedCustomer.id,
                      displayName: selectedCustomer.displayName,
                      companyName: selectedCustomer.companyName
                    }
                  : null
              )
            }}
          >
            <option value="">Select a customer</option>
            {customers?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName || c.companyName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Credit Note Number
          </label>
          <TextInput
            id="number"
            name="number"
            value={number}
            onChange={(e) => setNumber(e.currentTarget.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
              onSelect={(option) => setStatus(option.value as CreditNoteStatus)}
              buttonClassName="mt-1 w-full text-left"
              align="left"
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type
            </label>
            <Dropdown
              buttonLabel={typeOptions.find((opt) => opt.value === type)?.label || 'Select Type'}
              options={typeOptions}
              onSelect={(option) => setType(option.value as CreditNoteType)}
              buttonClassName="mt-1 w-full text-left"
              align="left"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Line Items
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Total:{' '}
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  calculatedTotal
                )}
              </span>
              <Button type="button" variant="outline" onClick={addLineItem}>
                Add Line Item
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-md dark:border-gray-700">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor={`line-description-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </label>
                    <TextArea
                      id={`line-description-${index}`}
                      name={`line-description-${index}`}
                      value={item.description || ''}
                      onChange={(e) =>
                        handleLineItemChange(index, 'description', e.currentTarget.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`line-quantity-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Quantity
                    </label>
                    <TextInput
                      type="number"
                      id={`line-quantity-${index}`}
                      name={`line-quantity-${index}`}
                      value={String(item.quantity) || ''}
                      onChange={(e) =>
                        handleLineItemChange(index, 'quantity', Number(e.currentTarget.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`line-unitprice-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Unit Price
                    </label>
                    <TextInput
                      type="number"
                      id={`line-unitprice-${index}`}
                      name={`line-unitprice-${index}`}
                      value={String(item.unitPrice) || ''}
                      onChange={(e) =>
                        handleLineItemChange(index, 'unitPrice', Number(e.currentTarget.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`line-total-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Total
                    </label>
                    <TextInput
                      type="number"
                      id={`line-total-${index}`}
                      name={`line-total-${index}`}
                      value={String(item.totalAmount) || '0'}
                      disabled
                      className="mt-1 bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="danger-outline"
                    onClick={() => removeLineItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
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
          <Button type="submit" isLoading={isLoading}>
            Create Credit Note
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateCreditNoteForm
