import { Button, Select, TextArea, TextInput, useToast } from '@apideck/components'

import {
  InvoiceItem,
  InvoiceItemInput,
  InvoiceItemTypeType as InvoiceItemType
} from '@apideck/unify/models/components'
import { useInvoiceItems } from 'hooks/useInvoiceItems'
import { useState } from 'react'

const CreateInvoiceItemForm = ({ closeForm }: { closeForm: any }) => {
  const { createInvoiceItem } = useInvoiceItems()
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [itemType, setItemType] = useState<InvoiceItemType>('service' as InvoiceItemType)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addToast } = useToast()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const invoiceItemToCreate: InvoiceItemInput = {
      name,
      description,
      unitPrice: unitPrice,
      type: itemType
      // expense_account: { id: '7' } // This was commented out, ensure new type for account linking if re-enabled
    }
    try {
      const response = await createInvoiceItem(invoiceItemToCreate as Omit<InvoiceItem, 'id'>)
      setIsLoading(false)

      // Check for a truthy response that indicates success (e.g., it has an ID)
      if (response && response.id) {
        addToast({
          title: 'New invoice item created',
          description: `ID: ${response.id}`,
          type: 'success'
        })
        closeForm()
      } else if (response && (response as any).message) {
        // Handle our API's error format
        addToast({
          title: 'Error creating invoice item',
          description: (response as any).message,
          type: 'error'
        })
      } else {
        addToast({
          title: 'Error creating invoice item',
          description: 'An unknown error occurred or response was not as expected.',
          type: 'error'
        })
      }
    } catch (error: any) {
      setIsLoading(false)
      addToast({
        title: 'Error creating invoice item',
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
          {/* Name of item */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Name
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextInput
                name="name"
                placeholder="Item name"
                onChange={(e) => setName(e.currentTarget.value)}
                className="block "
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Description
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextArea
                name="description"
                placeholder="Description of the item"
                onChange={(e) => setDescription(e.currentTarget.value)}
                className="block "
              />
            </div>
          </div>

          {/* Item type */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="itemType"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Type
              </label>
            </div>
            <div className="sm:col-span-2">
              <Select
                name="itemType"
                placeholder="Select item type"
                value={itemType}
                options={[
                  { label: 'Service', value: 'service' },
                  { label: 'Inventory', value: 'inventory' },
                  { label: 'Non-Inventory', value: 'non_inventory' },
                  { label: 'Description', value: 'description' },
                  { label: 'Other', value: 'other' }
                ]}
                onChange={(e) => setItemType(e.currentTarget.value as InvoiceItemType)}
                className="block "
              />
            </div>
          </div>

          {/* Unit price */}
          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="unitPrice"
                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
              >
                Unit price
              </label>
            </div>
            <div className="sm:col-span-2">
              <TextInput
                name="unitPrice"
                type="number"
                placeholder="100"
                onChange={(e) => setUnitPrice(Number(e.currentTarget.value))}
                className="block "
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

export default CreateInvoiceItemForm
