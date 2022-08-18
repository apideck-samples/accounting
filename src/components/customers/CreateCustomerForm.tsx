import { Button, useToast } from '@apideck/components'
import { EmailType, PhoneNumberType } from '@apideck/node'

import { useCustomers } from 'hooks'
import { useState } from 'react'

const CreateCustomerForm = ({ closeForm }: { closeForm: any }) => {
  const { createCustomer } = useCustomers()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const customer = {
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      phone_numbers: phoneNumber
        ? [{ number: phoneNumber, type: 'primary' as PhoneNumberType }]
        : [],
      emails: email ? [{ email, type: 'primary' as EmailType }] : [],
      notes
    }
    const response = await createCustomer(customer)
    setIsLoading(false)
    if (response.data) {
      addToast({ title: 'New customer created', description: '', type: 'success' })
      closeForm()
      return
    }
    if (response.error) {
      addToast({ title: 'Error creating customer', description: response.error, type: 'error' })
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
                name="lastName"
                id="lastName"
                placeholder="Doe"
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Email
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="email"
                id="email"
                placeholder="john@doe.com"
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Display name */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Phone number
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Doe"
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                defaultValue={''}
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
