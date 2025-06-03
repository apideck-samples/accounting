import { Button, useToast } from '@apideck/components'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { HiDotsVertical, HiMail, HiPhone } from 'react-icons/hi'

import type { Customer } from '@apideck/unify/models/components'
import Spinner from 'components/Spinner'
import { useCustomers } from 'hooks'

interface Props {
  customer: Customer
  onClose: () => void
}

const CustomerDetails = ({ customer, onClose }: Props) => {
  const { deleteCustomer } = useCustomers()
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const onDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteCustomer(id)
      addToast({
        title: 'Customer deleted',
        type: 'success'
      })
      setIsLoading(false)
      onClose()
    } catch (error: any) {
      addToast({
        title: 'Customer failed to delete',
        description: error?.message || 'An unexpected error occurred',
        type: 'error'
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="pb-6">
        <div className="h-24 bg-gradient bg-gradient-to-r from-primary-600 to-primary-500 sm:h-20 lg:h-28" />
        <div className="lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6">
          <div>
            <div className="-m-1 flex">
              <div className="inline-flex overflow-hidden rounded-lg border-4 border-white bg-white">
                <img
                  className="h-24 w-24 flex-shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                  src="https://www.iskibris.com/assets/images/placeholder-company.png"
                  alt="customer"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 sm:ml-6 sm:flex-1">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {customer?.displayName || customer?.firstName + ' ' + customer?.lastName}
                </h3>
              </div>
              <p className="text-sm text-gray-500">Customer ID: {customer?.id}</p>
            </div>
            <div className="mt-5 flex flex-wrap space-y-3 sm:space-y-0 sm:space-x-3">
              {customer.emails && customer.emails?.length > 0 && (
                <div className="w-0 flex-1 flex">
                  <a
                    href={`mailto:${customer.emails[0].email}`}
                    className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-2 text-sm text-gray-700 font-medium border border-gray-300 shadow-sm rounded-md hover:text-gray-500"
                  >
                    <HiMail className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    <span className="ml-3">Email</span>
                  </a>
                </div>
              )}
              {customer.phoneNumbers && customer.phoneNumbers?.length > 0 && (
                <div className="-ml-px w-0 flex-1 flex">
                  <a
                    href={`tel:${customer.phoneNumbers[0].number}`}
                    className="relative w-0 flex-1 inline-flex items-center justify-center py-2 text-sm text-gray-700 font-medium border border-gray-300 shadow-sm rounded-md hover:text-gray-500"
                  >
                    <HiPhone className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    <span className="ml-3">Call</span>
                  </a>
                </div>
              )}
              <div className="ml-3 inline-flex sm:ml-0">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open options menu</span>
                    {isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <HiDotsVertical className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-4 space-y-2 px-4">
                        <Menu.Item>
                          <Button
                            variant="danger-outline"
                            type="button"
                            isLoading={isLoading}
                            onClick={() => onDelete(customer?.id as string)}
                            className="text-gray-700 block text-sm w-full whitespace-nowrap"
                          >
                            Delete customer
                          </Button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:px-0 sm:py-0">
        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Emails
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              <p>{customer.emails?.map((c) => c?.email)?.join(', ')}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Phone numbers
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6 truncate">
              <p>{customer.phoneNumbers?.map((c) => c?.number)?.join(', ')}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Status
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6 capitalize">
              {customer?.status?.toString()}
            </dd>
          </div>
          {customer.createdAt && (
            <div className="sm:flex sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                Created at
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                {customer.createdAt && new Date(customer.createdAt).toLocaleDateString()}
              </dd>
            </div>
          )}
          {customer.updatedAt && (
            <div className="sm:flex sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                Created at
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                {customer.updatedAt && new Date(customer.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}

export default CustomerDetails
