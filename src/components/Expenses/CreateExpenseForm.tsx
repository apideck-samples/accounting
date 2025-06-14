import { Button, DateInput, Dropdown, TextArea, TextInput, useToast } from '@apideck/components'
import {
  Currency,
  Customer,
  Expense,
  LedgerAccount,
  LinkedCustomer,
  LinkedSupplier
} from '@apideck/unify/models/components'
import FormErrors from 'components/FormErrors'
import { useCustomers, useExpenses, useLedgerAccounts, useSuppliers } from 'hooks'
import { FormEvent, useMemo, useState } from 'react'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

interface DropdownOption {
  value: string
  label: string
}

const CreateExpenseForm = ({ closeForm }: { closeForm: any }) => {
  const { createExpense } = useExpenses()
  const { customers } = useCustomers()
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers()
  const { ledgerAccounts, isLoading: isLoadingLedgerAccounts } = useLedgerAccounts()
  const [customer, setCustomer] = useState<LinkedCustomer | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<LinkedSupplier | null>(null)
  const [selectedLedgerAccountId, setSelectedLedgerAccountId] = useState<string | undefined>(
    undefined
  )
  const [expenseNumber, setExpenseNumber] = useState<string>()
  const [memo, setMemo] = useState<string>()
  const [transactionDate, setTransactionDate] = useState<Date>()
  const [totalAmount, setTotalAmount] = useState<number>()
  const [paymentType, setPaymentType] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()
  const [formValidationIssues, setFormValidationIssues] = useState<
    ParsedFormValidationIssue[] | null
  >(null)

  const onCustomerSelect = (option: DropdownOption) => {
    setCustomer({ id: option.value, displayName: option.label })
    setSelectedSupplier(null)
  }

  const onSupplierSelect = (option: DropdownOption) => {
    setSelectedSupplier({ id: option.value, displayName: option.label })
    setCustomer(null)
  }

  const onLedgerAccountSelect = (option: DropdownOption) => {
    setSelectedLedgerAccountId(option.value)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormValidationIssues(null)

    const expenseToCreatePayload = {
      number: expenseNumber,
      memo: memo,
      transactionDate: transactionDate || null,
      customerId: customer?.id,
      supplierId: selectedSupplier?.id,
      accountId: selectedLedgerAccountId,
      totalAmount: totalAmount,
      paymentType: paymentType,
      type: 'expense' as const,
      currency: 'USD' as Currency,
      lineItems:
        totalAmount && !isNaN(totalAmount)
          ? [
              {
                totalAmount: totalAmount,
                description: memo || 'Expense item'
              }
            ]
          : []
    }

    const response = await createExpense(expenseToCreatePayload as Omit<Expense, 'id'>)

    setIsLoading(false)

    if (response && response.id && !response.error) {
      addToast({
        title: 'Expense Created',
        description: `Expense ${response.number || response.id} has been successfully created.`,
        type: 'success'
      })
      closeForm()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Expense Creation Failed'
      )

      addToast({ title: toastTitle, description: toastDescription, type: 'error' })
      if (formIssues.length > 0) {
        setFormValidationIssues(formIssues)
      }
    } else {
      addToast({
        title: 'Creation Failed',
        description:
          'An unexpected error occurred and the response was not in the expected format.',
        type: 'error'
      })
    }
  }

  const customerOptions: DropdownOption[] = useMemo(
    () =>
      customers
        ?.map((cust: Customer) => {
          if (!cust.id) return null
          return {
            value: cust.id,
            label:
              cust.displayName ||
              (cust.firstName && cust.lastName
                ? `${cust.firstName} ${cust.lastName}`
                : cust.companyName || cust.id || 'Unnamed Customer')
          }
        })
        .filter(
          (opt): opt is DropdownOption =>
            opt !== null && typeof opt.value === 'string' && typeof opt.label === 'string'
        ) || [],
    [customers]
  )

  const supplierOptions: DropdownOption[] = useMemo(() => {
    if (isLoadingSuppliers || !suppliers) return []
    return suppliers
      .map((supp) => {
        if (!supp.id) return null
        return {
          value: supp.id,
          label: supp.displayName || supp.companyName || supp.id || 'Unnamed Supplier'
        }
      })
      .filter(
        (opt): opt is DropdownOption =>
          opt !== null && typeof opt.value === 'string' && typeof opt.label === 'string'
      )
  }, [suppliers, isLoadingSuppliers])

  const ledgerAccountOptions: DropdownOption[] = useMemo(() => {
    if (isLoadingLedgerAccounts || !ledgerAccounts) return []

    return ledgerAccounts
      .filter((acc) => acc.status === 'active' && acc.id && acc.name)
      .map((acc: LedgerAccount) => ({
        value: acc.id || '123456',
        label: `${acc.name} (${
          acc.nominalCode || acc.displayId || acc.id?.substring(0, 6) + '...'
        }) - ${acc.subType || acc.type}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [ledgerAccounts, isLoadingLedgerAccounts])

  const paymentTypeOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'other', label: 'Other' }
  ]

  const getFieldError = (fieldPathKey: string): string | undefined => {
    if (!formValidationIssues) return undefined
    // fieldPathKey examples: "expense.transactionDate", "expense.line_items", "expense.supplierId"
    const fieldError = formValidationIssues.find(
      (issue) => issue.path && issue.path.join('.') === fieldPathKey
    )
    return fieldError?.message
  }

  return (
    <form
      className="flex h-full flex-col overflow-y-auto bg-white justify-between border-t"
      onSubmit={onSubmit}
    >
      <div className="flex-1">
        <FormErrors issues={formValidationIssues} />
        {/* Divider container */}
        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
          {/* Ledger Account */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Expense Account</h3>
            </div>
            <div className="sm:col-span-2">
              <div className="space-y-1">
                <label
                  htmlFor="ledgerAccount-dropdown"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Expense Account (Paid From/To)
                </label>
                <Dropdown
                  buttonLabel={
                    isLoadingLedgerAccounts
                      ? 'Loading Accounts...'
                      : ledgerAccountOptions.find((opt) => opt.value === selectedLedgerAccountId)
                          ?.label || 'Select Expense Account'
                  }
                  options={ledgerAccountOptions}
                  onSelect={
                    !isLoadingLedgerAccounts
                      ? (onLedgerAccountSelect as (option: any) => void)
                      : undefined
                  }
                  onClear={
                    !isLoadingLedgerAccounts
                      ? () => setSelectedLedgerAccountId(undefined)
                      : undefined
                  }
                  isSearchable={!isLoadingLedgerAccounts}
                  isScrollable={true}
                  minWidth={224}
                  align="left"
                  buttonClassName="w-full text-left !text-gray-700 dark:!text-gray-300 !font-normal"
                  className="!z-50"
                />
                {getFieldError('expense.accountId') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('expense.accountId')}</p>
                )}
                {getFieldError('expense.BankAccount.AccountID') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('expense.BankAccount.AccountID')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Customer</h3>
            </div>
            <div className="sm:col-span-2">
              <Dropdown
                buttonLabel={customer?.displayName || 'Select Customer'}
                key={'customer'}
                align={'left'}
                className="!z-40 text-left"
                buttonClassName="whitespace-nowrap !text-gray-700 !font-normal"
                onSelect={onCustomerSelect as (option: any) => void}
                isScrollable={true}
                isSearchable={true}
                onClear={() => setCustomer(null)}
                minWidth={224}
                options={customerOptions}
              />
              {getFieldError('expense.customerId') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.customerId')}</p>
              )}
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Supplier</h3>
            </div>
            <div className="sm:col-span-2">
              <Dropdown
                buttonLabel={
                  selectedSupplier?.displayName ||
                  (isLoadingSuppliers ? 'Loading Suppliers...' : 'Select Supplier')
                }
                options={supplierOptions}
                onSelect={
                  !isLoadingSuppliers ? (onSupplierSelect as (option: any) => void) : undefined
                }
                onClear={!isLoadingSuppliers ? () => setSelectedSupplier(null) : undefined}
                isSearchable={!isLoadingSuppliers}
                isScrollable={true}
                minWidth={224}
                align="left"
                buttonClassName="w-full text-left !text-gray-700 dark:!text-gray-300 !font-normal"
                className="!z-30"
              />
              {getFieldError('expense.supplierId') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.supplierId')}</p>
              )}
              {getFieldError('expense.Contact.ContactID') && (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('expense.Contact.ContactID')}
                </p>
              )}
            </div>
          </div>

          {/* Expense Number */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="expense-number"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Expense number
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextInput
                name="expenseNumber"
                id="expenseNumber"
                placeholder="Leave blank to auto-generate"
                onChange={(e) => setExpenseNumber(e.currentTarget.value)}
                className="block"
              />
              {getFieldError('expense.number') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.number')}</p>
              )}
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="memo"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Memo
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextArea
                id="memo"
                name="memo"
                className="block"
                defaultValue={''}
                onChange={(e) => setMemo(e.currentTarget.value)}
              />
              {getFieldError('expense.memo') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.memo')}</p>
              )}
            </div>
          </div>

          {/* Transaction Date */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Transaction date</h3>
            </div>
            <div className="sm:col-span-2">
              <DateInput
                name="transactionDate"
                type="date"
                containerClassName="!z-30"
                onChange={(e: any) =>
                  setTransactionDate(e.target?.value ? new Date(e.target.value) : undefined)
                }
                placeholder="Select Transaction Date"
                onClear={() => setTransactionDate(undefined)}
              />
              {getFieldError('expense.transactionDate') && (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('expense.transactionDate')}
                </p>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="totalAmount"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Total amount
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextInput
                name="totalAmount"
                id="totalAmount"
                type="number"
                placeholder="0.00"
                onChange={(e) => setTotalAmount(parseFloat(e.currentTarget.value))}
                className="block"
              />
              {getFieldError('expense.totalAmount') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.totalAmount')}</p>
              )}
            </div>
          </div>

          {/* Payment Type */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Payment Type</h3>
            </div>
            <div className="sm:col-span-2">
              <Dropdown
                buttonLabel={paymentType || 'Select Payment Type'}
                key={'paymentType'}
                align={'left'}
                className="!z-20 text-left"
                buttonClassName="whitespace-nowrap !text-gray-700 !font-normal"
                onSelect={(option: any) => setPaymentType(option.value)}
                isScrollable={true}
                isSearchable={true}
                onClear={() => setPaymentType(undefined)}
                minWidth={224}
                options={paymentTypeOptions}
              />
              {getFieldError('expense.paymentType') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.paymentType')}</p>
              )}
            </div>
          </div>
          {/* Line Items (Placeholder/Future improvement) */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div className="mb-3">
              <label htmlFor="line_items_label" className="block text-sm font-medium text-gray-900">
                Items (Note: Currently auto-created from Total Amount if not specified)
              </label>
              {getFieldError('expense.lineItems') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.lineItems')}</p>
              )}
              {getFieldError('expense.line_items') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('expense.line_items')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={closeForm}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading || isLoadingSuppliers || isLoadingLedgerAccounts}
          >
            Create
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateExpenseForm
