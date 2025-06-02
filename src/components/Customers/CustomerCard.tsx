import { HiMail, HiPhone } from 'react-icons/hi'

import type { Customer } from '@apideck/unify/models/components'
import SlideOver from 'components/SlideOver'
import { useState } from 'react'
import CustomerDetails from './CustomerDetails'

const CustomerCard = ({ customer }: { customer: Customer }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  return (
    <>
      <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 justify-between flex flex-col">
        <div
          className="group w-full flex items-start justify-between p-6 space-x-6 cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="text-gray-900 text-sm font-medium truncate group-hover:text-primary-600 transition">
                {customer.firstName || ''} {customer.lastName || ''}
              </h3>
            </div>
            <p className="mt-1 text-gray-500 text-sm truncate">
              {customer.companyName || customer.displayName || customer.notes}
            </p>
          </div>
          {customer.status && (
            <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full capitalize">
              {customer.status.toString()}
            </span>
          )}
        </div>
        <div>
          <div className="-mt-px flex divide-x divide-gray-200">
            {customer.emails && customer.emails?.length > 0 && (
              <div className="w-0 flex-1 flex">
                <a
                  href={`mailto:${customer.emails[0].email}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
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
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <HiPhone className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Call</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </li>
      <SlideOver
        isOpen={showDetails}
        title={`${customer?.displayName || customer.firstName || 'Customer Details'}`}
        onClose={() => setShowDetails(false)}
      >
        <CustomerDetails customer={customer} onClose={() => setShowDetails(false)} />
      </SlideOver>
    </>
  )
}

export default CustomerCard
