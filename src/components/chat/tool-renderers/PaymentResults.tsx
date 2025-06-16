import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardSection } from './CardSection'
import { ResultCard } from './ResultCard'

function PaymentCard({ payment, index }: { payment: any; index: number }) {
  const statusBadge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        payment.status === 'authorised'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : payment.status === 'voided'
          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      }`}
    >
      {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
    </span>
  )

  const headerIcon = (
    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
      <svg
        className="w-5 h-5 text-green-600 dark:text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"
        ></path>
      </svg>
    </div>
  )

  return (
    <ResultCard index={index}>
      <CardHeader
        icon={headerIcon}
        title={`${payment.currency} ${payment.totalAmount.toLocaleString()}`}
        subtitle={payment.customer?.companyName || 'N/A'}
        badge={statusBadge}
      />
      <CardSection className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Date</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {new Date(payment.transactionDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
          <p className="text-sm text-gray-900 dark:text-white">{payment.type}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reconciled</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {payment.reconciled ? 'Yes' : 'No'}
          </p>
        </div>
        {payment.reference && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reference</p>
            <p className="text-sm text-gray-900 dark:text-white">{payment.reference}</p>
          </div>
        )}
      </CardSection>

      {payment.allocations && payment.allocations.length > 0 && (
        <CardSection>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Allocations</p>
          <div className="space-y-2">
            {payment.allocations.map((allocation: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {allocation.code || 'N/A'}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {payment.currency} {allocation.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardSection>
      )}

      <CardFooter updatedAt={payment.updatedAt} id={payment.id} />
    </ResultCard>
  )
}

export function PaymentResults({ result }: { result: any[] }) {
  return (
    <div className="space-y-4">
      {result?.map((payment: any, index: number) => (
        <PaymentCard key={payment.id} payment={payment} index={index} />
      ))}
      {(!result || result.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">💸</div>
          <p>No payments found</p>
        </div>
      )}
    </div>
  )
}
