import { Button, useToast } from '@apideck/components'
import type { CustomerInput, Email, PhoneNumber } from '@apideck/unify/models/components'

import { useCustomers } from 'hooks'
import { useState } from 'react'

const CreateCustomerForm = ({ closeForm }: { closeForm: any }) => {
  const { createCustomer } = useCustomers()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    let finalDisplayName = displayName.trim()
    if (!finalDisplayName) {
      const first = firstName.trim()
      const last = lastName.trim()
      if (first && last) {
        finalDisplayName = `${first} ${last}`
      } else if (first) {
        finalDisplayName = first
      } else if (last) {
        finalDisplayName = last
      }
    }

    const customerPayload: CustomerInput = {
      firstName: firstName,
      lastName: lastName,
      displayName: finalDisplayName,
      phoneNumbers: phoneNumberValue
        ? [{ number: phoneNumberValue, type: 'primary' } as PhoneNumber]
        : undefined,
      emails: emailAddress ? [{ email: emailAddress, type: 'primary' } as Email] : undefined,
      notes: notes,
      passThrough: [
        {
          serviceId: 'xero', // Example of how to use passThrough
          operationId: 'accountingCustomersCreate',
          extendObject: {
            Name: finalDisplayName
          }
        }
      ]
    }
    try {
      const response = await createCustomer(customerPayload)
      setIsLoading(false)

      if (response && response.id) {
        addToast({
          title: 'New customer created',
          description: `ID: ${response.id}`,
          type: 'success'
        })
        closeForm()
      } else if (response && (response as any).message) {
        addToast({
          title: 'Error creating customer',
          description: (response as any).message,
          type: 'error'
        })
      } else if (!response) {
        addToast({
          title: 'Error creating customer',
          description: 'Failed to create customer. No response data.',
          type: 'error'
        })
      }
    } catch (error: any) {
      setIsLoading(false)
      addToast({
        title: 'Error creating customer',
        description: error?.message || 'An unexpected error occurred.',
        type: 'error'
      })
    }
  }

  return (
    <form
      className="flex h-full flex-col overflow-y-auto bg-white justify-between border-t"
      onSubmit={onSubmit}
    >
      <div className="flex-1">
        {/* Divider container */}
        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
          {/* First name */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                First name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Last name */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Last name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Display name */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Display name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="displayName"
                id="displayName"
                placeholder="John Doe Co."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Email
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="emailAddress"
                id="emailAddress"
                placeholder="john@doe.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Phone number */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="phoneNumberValue"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Phone number
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="phoneNumberValue"
                id="phoneNumberValue"
                placeholder="+14155552671"
                value={phoneNumberValue}
                onChange={(e) => setPhoneNumberValue(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Notes
              </label>
            </div>
            <div className="sm:col-span-2">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={notes}
                placeholder="Some notes about this customer"
                onChange={(e) => setNotes(e.target.value)}
              />
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
          <Button type="submit" isLoading={isLoading}>
            Create
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateCustomerForm
