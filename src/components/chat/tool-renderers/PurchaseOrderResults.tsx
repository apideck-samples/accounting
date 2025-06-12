import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardSection, CardSubSection } from './CardSection'
import { ResultCard } from './ResultCard'

function PurchaseOrderCard({ po, index }: { po: any; index: number }) {
  const statusBadge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        po.status === 'open'
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
          : po.status === 'billed'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : po.status === 'draft'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          : po.status === 'deleted'
          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      }`}
    >
      {po.status?.charAt(0).toUpperCase() + po.status?.slice(1)}
    </span>
  )

  const headerIcon = (
    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
      <svg
        className="w-5 h-5 text-orange-600 dark:text-orange-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 11V7a4 4 0 00-8 0v4M8 11v6a4 4 0 008 0v-6M8 11h8"
        />
      </svg>
    </div>
  )

  return (
    <ResultCard index={index}>
      <CardHeader
        icon={headerIcon}
        title={po.poNumber}
        subtitle={po.reference && `Ref: ${po.reference}`}
        badge={statusBadge}
      />

      {po.supplier?.id && (
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</span>
            </div>
            <p className="text-gray-900 dark:text-white font-mono text-xs">ID: {po.supplier.id}</p>
          </CardSubSection>
        </CardSection>
      )}

      <CardSection className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Issued Date
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(po.issuedDate).toLocaleDateString()}
          </p>
        </div>
        {po.deliveryDate && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Delivery Date
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(po.deliveryDate).toLocaleDateString()}
            </p>
          </div>
        )}
        {po.expectedArrivalDate && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Expected Arrival
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(po.expectedArrivalDate).toLocaleDateString()}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Amount
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {po.currency} {po.total?.toLocaleString()}
          </p>
        </div>
      </CardSection>

      <CardSection>
        <CardSubSection>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-white">
              {po.currency} {po.subTotal?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="text-gray-900 dark:text-white">
              {po.currency} {po.totalTax?.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">Total:</span>
              <span className="text-gray-900 dark:text-white">
                {po.currency} {po.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </CardSubSection>
      </CardSection>

      {po.lineItems && po.lineItems.length > 0 && (
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
            Order Items ({po.lineItems.length})
          </h4>
          <div className="space-y-2">
            {po.lineItems.slice(0, 3).map((item: any, _itemIndex: number) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span>
                        Unit: {po.currency} {item.unitPrice?.toLocaleString()}
                      </span>
                      {item.discountPercentage && (
                        <span className="text-green-600 dark:text-green-400">
                          -{item.discountPercentage}% discount
                        </span>
                      )}
                      {item.taxAmount > 0 && (
                        <span>
                          Tax: {po.currency} {item.taxAmount?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {po.currency} {item.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {po.lineItems.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                + {po.lineItems.length - 3} more items
              </p>
            )}
          </div>
        </CardSection>
      )}

      {po.shippingAddress && (
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Shipping Details
          </h4>
          <CardSubSection>
            {po.shippingAddress.contactName && (
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Contact: {po.shippingAddress.contactName}
              </p>
            )}
            {po.shippingAddress.phoneNumber && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Phone: {po.shippingAddress.phoneNumber}
              </p>
            )}
            {po.shippingAddress.string && (
              <div className="text-sm text-gray-900 dark:text-white mb-2">
                {po.shippingAddress.string
                  .split('\r\n')
                  .map(
                    (line: string, lineIndex: number) =>
                      line.trim() && <div key={lineIndex}>{line.trim()}</div>
                  )}
              </div>
            )}
            {po.shippingAddress.notes && (
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                Notes: {po.shippingAddress.notes}
              </p>
            )}
          </CardSubSection>
        </CardSection>
      )}

      <CardFooter updatedAt={po.updatedAt} id={po.id} />
    </ResultCard>
  )
}

export function PurchaseOrderResults({ result }: { result: any[] }) {
  return (
    <div className="space-y-4">
      {result?.map((po: any, index: number) => (
        <PurchaseOrderCard key={po.id} po={po} index={index} />
      ))}
      {(!result || result.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📋</div>
          <p>No purchase orders found</p>
        </div>
      )}
    </div>
  )
}
