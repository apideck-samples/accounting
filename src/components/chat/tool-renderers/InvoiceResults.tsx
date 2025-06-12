import { CardHeader } from './CardHeader'
import { CardSection, CardSubSection } from './CardSection'
import { ResultCard } from './ResultCard'

function InvoiceCard({ invoice, index }: { invoice: any; index: number }) {
  const statusBadge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        invoice.status === 'authorised'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : invoice.status === 'draft'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          : invoice.status === 'deleted'
          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      }`}
    >
      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
    </span>
  )

  const headerIcon = (
    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
      <svg
        className="w-5 h-5 text-green-600 dark:text-green-400"
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

  const footer = (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
        {invoice.invoiceSent && (
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Sent
          </span>
        )}
        <span>Updated: {new Date(invoice.updatedAt).toLocaleDateString()}</span>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
        ID: {invoice.id.slice(0, 8)}...
      </span>
    </div>
  )

  return (
    <ResultCard index={index}>
      <CardHeader
        icon={headerIcon}
        title={invoice.number}
        subtitle={`${invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)} Invoice`}
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
            {invoice.customer?.displayName}
          </p>
          {invoice.reference && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Reference: {invoice.reference}
            </p>
          )}
        </CardSubSection>
      </CardSection>

      <CardSection className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Invoice Date
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(invoice.invoiceDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Due Date
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Amount
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {invoice.currency} {invoice.total?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Balance Due
          </p>
          <p
            className={`text-sm font-semibold ${
              invoice.balance > 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {invoice.currency} {invoice.balance?.toLocaleString()}
          </p>
        </div>
      </CardSection>

      <CardSection>
        <CardSubSection>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-white">
              {invoice.currency} {invoice.subTotal?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="text-gray-900 dark:text-white">
              {invoice.currency} {invoice.totalTax?.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">Total:</span>
              <span className="text-gray-900 dark:text-white">
                {invoice.currency} {invoice.total?.toLocaleString()}
              </span>
            </div>
          </div>
          {invoice.taxInclusive && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">* Tax inclusive pricing</p>
          )}
        </CardSubSection>
      </CardSection>

      {invoice.lineItems && invoice.lineItems.length > 0 && (
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
            Line Items ({invoice.lineItems.length})
          </h4>
          <div className="space-y-2">
            {invoice.lineItems.slice(0, 3).map((item: any, _itemIndex: number) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded font-mono">
                        {item.code}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.item?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span>
                        Unit: {invoice.currency} {item.unitPrice?.toLocaleString()}
                      </span>
                      {item.taxAmount > 0 && (
                        <span>
                          Tax: {invoice.currency} {item.taxAmount?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {invoice.currency} {item.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {invoice.lineItems.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                + {invoice.lineItems.length - 3} more items
              </p>
            )}
          </div>
        </CardSection>
      )}
      {footer}
    </ResultCard>
  )
}

export function InvoiceResults({ result }: { result: any[] }) {
  return (
    <div className="space-y-5">
      {result?.map((invoice: any, index: number) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
      ))}
      {(!result || result.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📭</div>
          <p>No invoices found</p>
        </div>
      )}
    </div>
  )
}
