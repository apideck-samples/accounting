import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardSection, CardSubSection } from './CardSection'
import { ResultCard } from './ResultCard'

function ExpenseCard({ expense, index }: { expense: any; index: number }) {
  const headerIcon = (
    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
      <svg
        className="w-5 h-5 text-red-600 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h2m8-4V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0V7a2 2 0 012-2h2"
        />
      </svg>
    </div>
  )

  const amountBadge = (
    <div className="text-right">
      <div className="text-lg font-bold text-red-600 dark:text-red-400">
        -{expense.currency} {expense.totalAmount?.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">Total Amount</div>
    </div>
  )

  return (
    <ResultCard index={index}>
      <CardHeader
        icon={headerIcon}
        title={expense.type?.charAt(0).toUpperCase() + expense.type?.slice(1) || 'Expense'}
        subtitle={expense.memo}
        badge={amountBadge}
      />
      <CardSection className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Transaction Date
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(expense.transactionDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Currency
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.currency}</p>
        </div>
      </CardSection>

      {(expense.supplierId || expense.customerId) && (
        <CardSection>
          <CardSubSection>
            <div className="flex items-center space-x-2 mb-1">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {expense.supplierId ? 'Supplier' : 'Customer'}
              </span>
            </div>
            <p className="text-gray-900 dark:text-white font-mono text-xs">
              ID: {expense.supplierId || expense.customerId}
            </p>
          </CardSubSection>
        </CardSection>
      )}

      {expense.lineItems && expense.lineItems.length > 0 && (
        <CardSection>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Line Items ({expense.lineItems.length})
          </h4>
          <div className="space-y-2">
            {expense.lineItems.slice(0, 3).map((item: any, _itemIndex: number) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {item.description && (
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      {item.accountId && (
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded font-mono">
                          Account: {item.accountId.slice(0, 8)}...
                        </span>
                      )}
                      {item.taxRate?.id && (
                        <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded">
                          Tax: {item.taxRate.id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{expense.currency} {item.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {expense.lineItems.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                + {expense.lineItems.length - 3} more items
              </p>
            )}
          </div>
        </CardSection>
      )}

      {expense.accountId && (
        <CardSection>
          <CardSubSection>
            <div className="flex items-center space-x-2 mb-1">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white font-mono text-xs">
              {expense.accountId}
            </p>
          </CardSubSection>
        </CardSection>
      )}

      <CardFooter updatedAt={expense.updatedAt} id={expense.id} />
    </ResultCard>
  )
}

export function ExpenseResults({ result }: { result: any[] }) {
  return (
    <div className="space-y-4">
      {result?.map((expense: any, index: number) => (
        <ExpenseCard key={expense.id} expense={expense} index={index} />
      ))}
      {(!result || result.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">💸</div>
          <p>No expenses found</p>
        </div>
      )}
    </div>
  )
}
