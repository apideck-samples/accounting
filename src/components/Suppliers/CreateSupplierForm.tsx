import { Button, Dropdown, TextArea, TextInput, useToast } from '@apideck/components'
import {
  Address, // Import Address type
  Currency,
  Email, // Use Email type for the array
  PhoneNumber, // Use PhoneNumber type for the array
  Supplier, // The main Supplier type from Unify
  SupplierStatus // Enum for supplier status
} from '@apideck/unify/models/components'
import FormErrors from 'components/FormErrors'
import { useSuppliers } from 'hooks'
import { FormEvent, useState } from 'react'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

// Define a simpler Address state for the form
interface FormAddress {
  line1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

const CreateSupplierForm = ({ closeForm }: { closeForm: any }) => {
  const { createSupplier } = useSuppliers()
  const [displayName, setDisplayName] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [status, setStatus] = useState<SupplierStatus>(SupplierStatus.Active)
  const [currency, setCurrency] = useState<string>('USD')
  const [taxNumber, setTaxNumber] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [address, setAddress] = useState<FormAddress>({})

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()
  const [formValidationIssues, setFormValidationIssues] = useState<
    ParsedFormValidationIssue[] | null
  >(null)

  const handleAddressChange = (field: keyof FormAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormValidationIssues(null)

    const emailsArray: Email[] = email ? [{ email: email, type: 'primary' }] : []
    const phonesArray: PhoneNumber[] = phone ? [{ number: phone, type: 'primary' }] : []
    const addressesArray: Address[] =
      address.line1 || address.city || address.postalCode
        ? [
            {
              type: 'primary',
              line1: address.line1,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country
            }
          ]
        : []

    const supplierToCreate = {
      displayName: displayName || companyName || `${firstName} ${lastName}`.trim() || undefined,
      companyName: companyName || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      emails: emailsArray.length > 0 ? emailsArray : undefined,
      phoneNumbers: phonesArray.length > 0 ? phonesArray : undefined,
      addresses: addressesArray.length > 0 ? addressesArray : undefined,
      status: status,
      currency: currency as Currency,
      taxNumber: taxNumber || undefined,
      notes: notes || undefined
      // Other fields like bankAccounts, account can be added later
    }

    const response = await createSupplier(supplierToCreate as Omit<Supplier, 'id'>)
    setIsLoading(false)

    if (response && response.id && !response.error) {
      addToast({ title: 'Supplier created successfully', type: 'success' })
      closeForm()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Supplier Creation Failed'
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

  const getFieldError = (fieldPathKey: string): string | undefined => {
    if (!formValidationIssues) return undefined
    const fieldError = formValidationIssues.find(
      (issue) => issue.path && issue.path.join('.') === fieldPathKey
    )
    return fieldError?.message
  }

  const statusOptions = Object.values(SupplierStatus).map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: s
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
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Display Name
          </label>
          <TextInput
            id="displayName"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.currentTarget.value)}
            className="mt-1"
            placeholder="e.g. Acme Corp or John Doe"
          />
          {getFieldError('supplier.displayName') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.displayName')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Company Name
          </label>
          <TextInput
            id="companyName"
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.currentTarget.value)}
            className="mt-1"
          />
          {getFieldError('supplier.companyName') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.companyName')}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              First Name
            </label>
            <TextInput
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              className="mt-1"
            />
            {getFieldError('supplier.firstName') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.firstName')}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Last Name
            </label>
            <TextInput
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              className="mt-1"
            />
            {getFieldError('supplier.lastName') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.lastName')}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Primary Email
          </label>
          <TextInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="mt-1"
          />
          {getFieldError('supplier.emails') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.emails')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Primary Phone
          </label>
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            className="mt-1"
          />
          {getFieldError('supplier.phoneNumbers') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.phoneNumbers')}</p>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Primary Address
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="addressLine1"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Street address
              </label>
              <TextInput
                id="addressLine1"
                name="addressLine1"
                value={address.line1 || ''}
                onChange={(e) => handleAddressChange('line1', e.currentTarget.value)}
                className="mt-1"
              />
              {getFieldError('supplier.addresses.line1') && (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('supplier.addresses.line1')}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addressCity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                City
              </label>
              <TextInput
                id="addressCity"
                name="addressCity"
                value={address.city || ''}
                onChange={(e) => handleAddressChange('city', e.currentTarget.value)}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addressState"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                State / Province
              </label>
              <TextInput
                id="addressState"
                name="addressState"
                value={address.state || ''}
                onChange={(e) => handleAddressChange('state', e.currentTarget.value)}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addressPostalCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ZIP / Postal code
              </label>
              <TextInput
                id="addressPostalCode"
                name="addressPostalCode"
                value={address.postalCode || ''}
                onChange={(e) => handleAddressChange('postalCode', e.currentTarget.value)}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="addressCountry"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Country
              </label>
              <TextInput
                id="addressCountry"
                name="addressCountry"
                value={address.country || ''}
                onChange={(e) => handleAddressChange('country', e.currentTarget.value)}
                placeholder="e.g. US"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="statusDropdown"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <Dropdown
              buttonLabel={
                statusOptions.find((opt) => opt.value === status)?.label || 'Select Status'
              }
              options={statusOptions}
              onSelect={(option) => setStatus(option.value as SupplierStatus)}
              buttonClassName="mt-1 w-full text-left"
              align="left"
            />
            {getFieldError('supplier.status') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.status')}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Currency
            </label>
            <TextInput
              id="currency"
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.currentTarget.value)}
              className="mt-1"
              placeholder="e.g. USD"
            />
            {getFieldError('supplier.currency') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.currency')}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="taxNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tax Number
          </label>
          <TextInput
            id="taxNumber"
            name="taxNumber"
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.currentTarget.value)}
            className="mt-1"
          />
          {getFieldError('supplier.taxNumber') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.taxNumber')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notes
          </label>
          <TextArea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            className="mt-1"
          />
          {getFieldError('supplier.notes') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('supplier.notes')}</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
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
            Create Supplier
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateSupplierForm
