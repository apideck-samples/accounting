import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardSection, CardSubSection } from './CardSection'
import { ResultCard } from './ResultCard'

function CreditNoteCard({ creditNote, index }: { creditNote: any; index: number }) {
  const statusBadge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        creditNote.status === 'paid'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : creditNote.status === 'deleted'
          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      }`}
    >
      {creditNote.status?.charAt(0).toUpperCase() + creditNote.status?.slice(1)}
    </span>
  )

  const headerIcon = (
    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
      <svg
        className="w-5 h-5 text-purple-600 dark:text-purple-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  )

  return (
    <ResultCard index={index}>
      <CardHeader
        icon={headerIcon}
        title={creditNote.number}
        subtitle={
          creditNote.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
          'Credit Note'
        }
        badge={statusBadge}
      />

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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer</span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">
            {creditNote.customer?.displayName}
          </p>
          {creditNote.reference && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Reference: {creditNote.reference}
            </p>
          )}
        </CardSubSection>
      </CardSection>

      <CardSection className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Date Issued
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(creditNote.dateIssued).toLocaleDateString()}
          </p>
        </div>
        {creditNote.datePaid && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Date Paid
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(creditNote.datePaid).toLocaleDateString()}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Credit
          </p>
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            {creditNote.currency} {creditNote.totalAmount?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Remaining Credit
          </p>
          <p
            className={`text-sm font-semibold ${
              creditNote.remainingCredit > 0
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {creditNote.currency} {creditNote.remainingCredit?.toLocaleString()}
          </p>
        </div>
      </CardSection>

      <CardSection>
        <CardSubSection>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-white">
              {creditNote.currency} {creditNote.subTotal?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="text-gray-900 dark:text-white">
              {creditNote.currency} {creditNote.totalTax?.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">Total Credit:</span>
              <span className="text-purple-600 dark:text-purple-400">
                {creditNote.currency} {creditNote.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
          {creditNote.taxInclusive && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">* Tax inclusive pricing</p>
          )}
        </CardSubSection>
      </CardSection>

      {creditNote.lineItems && creditNote.lineItems.length > 0 && (
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
            Credit Items ({creditNote.lineItems.length})
          </h4>
          <div className="space-y-2">
            {creditNote.lineItems.slice(0, 3).map((item: any, _itemIndex: number) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {item.code && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded font-mono">
                          {item.code}
                        </span>
                      )}
                      {item.item?.name && (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.item.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span>
                        Unit: {creditNote.currency} {item.unitPrice?.toLocaleString()}
                      </span>
                      {item.taxAmount > 0 && (
                        <span>
                          Tax: {creditNote.currency} {item.taxAmount?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {creditNote.currency} {item.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {creditNote.lineItems.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                + {creditNote.lineItems.length - 3} more items
              </p>
            )}
          </div>
        </CardSection>
      )}

      {creditNote.allocations && creditNote.allocations.length > 0 && (
        <CardSection>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Applied To:</h4>
          <div className="space-y-1">
            {creditNote.allocations.slice(0, 2).map((allocation: any, _allocIndex: number) => (
              <div
                key={allocation.id}
                className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 text-sm"
              >
                <span className="font-medium">
                  {allocation.type?.toUpperCase()}: {allocation.code}
                </span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  {creditNote.currency} {allocation.amount?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardSection>
      )}

      <CardFooter updatedAt={creditNote.updatedAt} id={creditNote.id} />
    </ResultCard>
  )
}

export function CreditNoteResults({ result }: { result: any[] }) {
  return (
    <div className="space-y-4">
      {result?.map((creditNote: any, index: number) => (
        <CreditNoteCard key={creditNote.id} creditNote={creditNote} index={index} />
      ))}
      {(!result || result.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📄</div>
          <p>No credit notes found</p>
        </div>
      )}
    </div>
  )
}
