import { Chip, useToast } from '@apideck/components'
import type { BankAccount, Supplier } from '@apideck/unify/models/components'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

import FormErrors from 'components/FormErrors'
import Spinner from 'components/Spinner'
import { useSuppliers } from 'hooks'
import {
  HiOutlineCreditCard,
  HiOutlineDotsVertical,
  HiOutlineGlobeAlt,
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlinePhone,
  HiOutlineTrash
} from 'react-icons/hi'
import {
  parseApiResponseError,
  FormValidationIssue as ParsedFormValidationIssue
} from 'utils/errorUtils'

interface Props {
  supplier: Supplier
  onClose: () => void
}

const SupplierDetails = ({ supplier, onClose }: Props) => {
  const { deleteSupplier } = useSuppliers()
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const [deleteErrorIssues, setDeleteErrorIssues] = useState<ParsedFormValidationIssue[] | null>(
    null
  )

  const onDelete = async (id: string) => {
    setIsLoading(true)
    setDeleteErrorIssues(null)
    const response = await deleteSupplier(id)
    setIsLoading(false)

    if (response && response.success) {
      addToast({
        title: 'Supplier deleted',
        description: `Supplier ${
          supplier.displayName || supplier.id
        } has been successfully deleted.`,
        type: 'success'
      })
      onClose()
    } else if (response && response.error) {
      const { toastTitle, toastDescription, formIssues } = parseApiResponseError(
        response.error,
        'Deletion Failed'
      )
      addToast({ title: toastTitle, description: toastDescription, type: 'error' })
      if (formIssues.length > 0) {
        setDeleteErrorIssues(formIssues)
      }
    } else {
      addToast({
        title: 'Deletion Failed',
        description: 'An unexpected error occurred while trying to delete the supplier.',
        type: 'error'
      })
    }
  }

  const primaryAddress =
    supplier.addresses?.find((a) => a.type === 'primary') || supplier.addresses?.[0]
  const primaryEmail = supplier.emails?.find((e) => e.type === 'primary') || supplier.emails?.[0]
  const primaryPhone =
    supplier.phoneNumbers?.find((p) => p.type === 'primary') || supplier.phoneNumbers?.[0]
  const primaryWebsite =
    supplier.websites?.find((w) => w.type === 'primary') || supplier.websites?.[0]

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Header Section */}
      <div className="pb-6">
        <div className="h-24 bg-gradient bg-gradient-to-r from-purple-600 to-indigo-600 sm:h-20 lg:h-28" />
        <div className="mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-15">
          <div>
            <div className="-m-1 flex">
              <div className="inline-flex overflow-hidden rounded-lg border-4 border-white bg-white dark:border-gray-800 dark:bg-gray-700">
                <HiOutlineOfficeBuilding className="h-24 w-24 p-4 text-gray-500 dark:text-gray-400 sm:h-40 sm:w-40 lg:h-44 lg:w-44 p-6" />
              </div>
            </div>
          </div>
          <div className="mb-6 sm:ml-6 sm:flex-1">
            <div className="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {supplier.displayName || supplier.companyName || 'N/A'}
                </h3>
                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  ID: {supplier.id}
                </p>
              </div>
              <div className="mt-4 flex flex-shrink-0 items-center gap-x-3 sm:mt-0 sm:ml-4">
                {supplier.status && (
                  <Chip
                    label={supplier.status.toString()}
                    className="inline-flex uppercase"
                    colorClassName={
                      supplier.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                    }
                  />
                )}
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <span className="sr-only">Open options menu</span>
                    {isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <HiOutlineDotsVertical className="h-5 w-5" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => onDelete(supplier.id as string)}
                              disabled={isLoading}
                              className={`${
                                active
                                  ? 'bg-red-100 text-red-900 dark:bg-red-700 dark:text-red-100'
                                  : 'text-red-700 dark:text-red-200'
                              } group flex w-full items-center px-4 py-2 text-left text-sm`}
                            >
                              {isLoading ? (
                                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <HiOutlineTrash
                                  className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
                                  aria-hidden="true"
                                />
                              )}
                              {isLoading ? 'Deleting...' : 'Delete Supplier'}
                            </button>
                          )}
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

      {deleteErrorIssues && deleteErrorIssues.length > 0 && (
        <div className="px-4 pt-2 sm:px-6">
          <FormErrors issues={deleteErrorIssues} title="Could not delete supplier:" />
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 sm:py-0">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {(supplier.firstName || supplier.lastName) && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Contact Person
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {`${supplier.title || ''} ${supplier.firstName || ''} ${
                  supplier.middleName || ''
                } ${supplier.lastName || ''} ${supplier.suffix || ''}`
                  .trim()
                  .replace(/\s+/g, ' ')}
              </dd>
            </div>
          )}
          {primaryEmail && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <HiOutlineMail className="mr-2 h-4 w-4" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <a
                  href={`mailto:${primaryEmail.email}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {primaryEmail.email}
                </a>{' '}
                ({primaryEmail.type})
              </dd>
            </div>
          )}
          {primaryPhone && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <HiOutlinePhone className="mr-2 h-4 w-4" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {primaryPhone.number} ({primaryPhone.type})
              </dd>
            </div>
          )}
          {primaryAddress && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <HiOutlineLocationMarker className="mr-2 h-4 w-4" />
                Primary Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {primaryAddress.string ||
                  `${primaryAddress.line1 || ''}${
                    primaryAddress.line2 ? ', ' + primaryAddress.line2 : ''
                  }${primaryAddress.city ? ', ' + primaryAddress.city : ''}${
                    primaryAddress.state ? ', ' + primaryAddress.state : ''
                  } ${primaryAddress.postalCode || ''} (${primaryAddress.country || ''})`
                    .trim()
                    .replace(/^,|,$/g, '')
                    .replace(/\s+,/g, ',')}
                ({primaryAddress.type})
              </dd>
            </div>
          )}
          {supplier.taxNumber && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <HiOutlineInformationCircle className="mr-2 h-4 w-4" />
                Tax Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.taxNumber}</dd>
            </div>
          )}
          {supplier.currency && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Default Currency
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.currency}</dd>
            </div>
          )}
          {primaryWebsite && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <HiOutlineGlobeAlt className="mr-2 h-4 w-4" />
                Website
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <a
                  href={primaryWebsite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {primaryWebsite.url}
                </a>{' '}
                ({primaryWebsite.type})
              </dd>
            </div>
          )}
          {supplier.account && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">GL Account</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                ID: {supplier.account.id}{' '}
                {supplier.account.nominalCode && `(${supplier.account.nominalCode})`}
              </dd>
            </div>
          )}
          {supplier.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {supplier.notes}
              </dd>
            </div>
          )}
        </dl>

        {supplier.bankAccounts && supplier.bankAccounts.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiOutlineCreditCard className="mr-2 h-5 w-5" />
              Bank Accounts
            </h4>
            <ul
              role="list"
              className="mt-2 divide-y divide-gray-200 dark:divide-gray-700 border-t border-b dark:border-gray-700"
            >
              {supplier.bankAccounts.map((account: BankAccount, idx: number) => (
                <li key={idx} className="py-3 flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {account.bankName} - {account.accountName}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ending in {account.accountNumber?.slice(-4)} ({account.accountType})
                    </p>
                  </div>
                  {account.currency && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{account.currency}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupplierDetails
