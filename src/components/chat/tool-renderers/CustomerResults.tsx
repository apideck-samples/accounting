import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardSection, CardSubSection } from './CardSection'
import { ResultCard } from './ResultCard'

function CustomerCard({ customer, index }: { customer: any; index: number }) {
  const statusBadge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        customer.status === 'active'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : customer.status === 'inactive'
          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      }`}
    >
      {customer.status?.charAt(0).toUpperCase() + customer.status?.slice(1)}
    </span>
  )

  const headerIcon = (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
      <svg
        className="w-5 h-5 text-blue-600 dark:text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  )

  return (
    <ResultCard index={index}>
      <CardHeader
        icon={headerIcon}
        title={customer.displayName || customer.companyName}
        subtitle={
          customer.displayName !== customer.companyName && customer.companyName
            ? customer.companyName
            : undefined
        }
        badge={statusBadge}
      />
      <CardSection className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customer.emails && customer.emails.length > 0 && (
          <CardSubSection>
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
            </div>
            {customer.emails.slice(0, 2).map((email: any, emailIndex: number) => (
              <div key={emailIndex} className="mb-1 last:mb-0">
                <a
                  href={`mailto:${email.email}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {email.email}
                </a>
                {email.type && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({email.type})
                  </span>
                )}
              </div>
            ))}
          </CardSubSection>
        )}

        {customer.phoneNumbers && customer.phoneNumbers.length > 0 && (
          <CardSubSection>
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</span>
            </div>
            {customer.phoneNumbers.slice(0, 2).map((phone: any, phoneIndex: number) => (
              <div key={phoneIndex} className="mb-1 last:mb-0">
                <a
                  href={`tel:${phone.countryCode}${phone.areaCode}${phone.number}`}
                  className="text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {phone.countryCode && `+${phone.countryCode} `}
                  {phone.areaCode && `(${phone.areaCode}) `}
                  {phone.number}
                </a>
                {phone.type && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({phone.type})
                  </span>
                )}
              </div>
            ))}
          </CardSubSection>
        )}
      </CardSection>

      {customer.addresses && customer.addresses.length > 0 && (
        <CardSection>
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</span>
          </div>
          {customer.addresses.slice(0, 1).map((address: any, addressIndex: number) => (
            <CardSubSection key={addressIndex}>
              {address.type && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mb-2">
                  {address.type}
                </span>
              )}
              <div className="text-sm text-gray-900 dark:text-white space-y-1">
                {address.line1 && <div>{address.line1.trim()}</div>}
                {address.line2 && <div>{address.line2.trim()}</div>}
                {address.line3 && <div>{address.line3.trim()}</div>}
                {address.line4 && <div>{address.line4.trim()}</div>}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  {address.city && <span>{address.city}</span>}
                  {address.state && <span>{address.state}</span>}
                  {address.postalCode && <span>{address.postalCode}</span>}
                  {address.country && <span>{address.country}</span>}
                </div>
              </div>
            </CardSubSection>
          ))}
        </CardSection>
      )}
      <CardFooter updatedAt={customer.updatedAt} id={customer.id} />
    </ResultCard>
  )
}

export function CustomerResults({ result }: { result: any[] }) {
  return (
    <div className="space-y-4">
      {result?.map((customer: any, index: number) => (
        <CustomerCard key={customer.id} customer={customer} index={index} />
      ))}
      {(!result || result.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">👥</div>
          <p>No customers found</p>
        </div>
      )}
    </div>
  )
}
