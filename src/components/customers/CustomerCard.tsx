import { HiMail, HiPhone } from 'react-icons/hi'

import { AccountingCustomer } from '@apideck/node'

const CustomerCard = ({ customer }: { customer: AccountingCustomer }) => {
  return (
    <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 justify-between flex flex-col">
      <div className="w-full flex items-start justify-between p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-gray-900 text-sm font-medium truncate">
              {customer.first_name} {customer.last_name}
            </h3>
          </div>
          <p className="mt-1 text-gray-500 text-sm truncate">
            {customer.company_name || customer.display_name || customer.notes}
          </p>
        </div>
        {customer.status && (
          <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
            {customer.status}
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
          {customer.phone_numbers && customer.phone_numbers?.length > 0 && (
            <div className="-ml-px w-0 flex-1 flex">
              <a
                href={`tel:${customer.phone_numbers[0].number}`}
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
  )
}

export default CustomerCard
