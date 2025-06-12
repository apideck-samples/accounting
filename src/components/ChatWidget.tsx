'use client'

import { useChat } from '@ai-sdk/react'
import { useConnections } from 'hooks/useConnections'
import { useSession } from 'hooks/useSession'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

// Tool result renderer component
function ToolResultRenderer({ toolInvocation }: { toolInvocation: any }) {
  const { toolName, result, state } = toolInvocation

  // Handle loading state for tools that are still executing
  if (state === 'call' || state === 'partial-call' || !result) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 rounded-full animate-spin"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        </div>

        {/* Skeleton cards based on tool type */}
        {toolName?.includes('list') || toolName?.includes('List') ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 space-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          // Single card skeleton for reports
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Handle error cases
  if (result?.error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2">
          <span className="text-red-500">❌</span>
          <span className="font-medium">Error</span>
        </div>
        <div className="mt-1">{result.error}</div>
      </div>
    )
  }

  // Handle cases where result is not an array when expected (only after completion)
  if (
    state === 'result' &&
    !Array.isArray(result) &&
    (toolName.startsWith('list') || toolName.includes('list'))
  ) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg text-sm border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">⚠️</span>
          <span className="font-medium">No Data</span>
        </div>
        <div className="mt-1">No data available</div>
      </div>
    )
  }

  // Handle empty arrays (only after completion)
  if (state === 'result' && Array.isArray(result) && result.length === 0) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📭</span>
          <span className="font-medium">Empty Results</span>
        </div>
        <div className="mt-1">No {toolName.replace('list', '').toLowerCase()} found</div>
      </div>
    )
  }

  if (toolName === 'listCustomers') {
    return (
      <div className="space-y-4">
        {result?.map((customer: any, index: number) => (
          <div
            key={customer.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header with Company Name and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
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
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {customer.displayName || customer.companyName}
                  </h3>
                  {customer.displayName !== customer.companyName && customer.companyName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {customer.companyName}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
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
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Email */}
              {customer.emails && customer.emails.length > 0 && (
                <div className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3">
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
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </span>
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
                </div>
              )}

              {/* Phone */}
              {customer.phoneNumbers && customer.phoneNumbers.length > 0 && (
                <div className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3">
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
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </span>
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
                </div>
              )}
            </div>

            {/* Address Section */}
            {customer.addresses && customer.addresses.length > 0 && (
              <div className="mb-4">
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </span>
                </div>
                {customer.addresses.slice(0, 1).map((address: any, addressIndex: number) => (
                  <div
                    key={addressIndex}
                    className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3"
                  >
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
                  </div>
                ))}
              </div>
            )}

            {/* Footer with metadata */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {new Date(customer.updatedAt).toLocaleDateString()}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                ID: {customer.id.slice(0, 8)}...
              </span>
            </div>
          </div>
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

  if (toolName === 'listInvoices') {
    return (
      <div className="space-y-5">
        {result?.map((invoice: any, index: number) => (
          <div
            key={invoice.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header with Invoice Number and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
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
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {invoice.number}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)} Invoice
                  </p>
                </div>
              </div>

              {/* Status Badge */}
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
            </div>

            {/* Customer Information */}
            <div className="mb-4 p-3 bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg">
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
                  Customer
                </span>
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {invoice.customer?.displayName}
              </p>
              {invoice.reference && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Reference: {invoice.reference}
                </p>
              )}
            </div>

            {/* Dates and Financial Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            </div>

            {/* Financial Breakdown */}
            <div className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  * Tax inclusive pricing
                </p>
              )}
            </div>

            {/* Line Items */}
            {invoice.lineItems && invoice.lineItems.length > 0 && (
              <div>
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
              </div>
            )}

            {/* Additional Info */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {invoice.invoiceSent && (
                  <span className="flex items-center">
                    <svg
                      className="w-3 h-3 mr-1 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
          </div>
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

  if (toolName === 'listExpenses') {
    return (
      <div className="space-y-4">
        {result?.map((expense: any, index: number) => (
          <div
            key={expense.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header with Type and Amount */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
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
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {expense.type?.charAt(0).toUpperCase() + expense.type?.slice(1) || 'Expense'}
                  </h3>
                  {expense.memo && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{expense.memo}</p>
                  )}
                </div>
              </div>

              {/* Total Amount Badge */}
              <div className="text-right">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  -{expense.currency} {expense.totalAmount?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Amount</div>
              </div>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Date */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Transaction Date
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(expense.transactionDate).toLocaleDateString()}
                </p>
              </div>

              {/* Currency */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Currency
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {expense.currency}
                </p>
              </div>
            </div>

            {/* Supplier/Customer Information */}
            {(expense.supplierId || expense.customerId) && (
              <div className="mb-4 p-3 bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg">
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
              </div>
            )}

            {/* Line Items */}
            {expense.lineItems && expense.lineItems.length > 0 && (
              <div className="mb-4">
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
              </div>
            )}

            {/* Account Information */}
            {expense.accountId && (
              <div className="mb-4 p-3 bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg">
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-mono text-xs">
                  {expense.accountId}
                </p>
              </div>
            )}

            {/* Footer with metadata */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {new Date(expense.updatedAt).toLocaleDateString()}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                ID: {expense.id.slice(0, 8)}...
              </span>
            </div>
          </div>
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

  if (toolName === 'listCreditNotes') {
    return (
      <div className="space-y-4">
        {result?.map((creditNote: any, index: number) => (
          <div
            key={creditNote.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header with Credit Note Number and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
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
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {creditNote.number}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {creditNote.type
                      ?.replace(/_/g, ' ')
                      .replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Credit Note'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
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
            </div>

            {/* Customer Information */}
            <div className="mb-4 p-3 bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg">
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
                  Customer
                </span>
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {creditNote.customer?.displayName}
              </p>
              {creditNote.reference && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Reference: {creditNote.reference}
                </p>
              )}
            </div>

            {/* Dates and Financial Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            </div>

            {/* Financial Breakdown */}
            <div className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  * Tax inclusive pricing
                </p>
              )}
            </div>

            {/* Line Items */}
            {creditNote.lineItems && creditNote.lineItems.length > 0 && (
              <div className="mb-4">
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
              </div>
            )}

            {/* Allocations */}
            {creditNote.allocations && creditNote.allocations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Applied To:
                </h4>
                <div className="space-y-1">
                  {creditNote.allocations
                    .slice(0, 2)
                    .map((allocation: any, _allocIndex: number) => (
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
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {new Date(creditNote.updatedAt).toLocaleDateString()}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                ID: {creditNote.id.slice(0, 8)}...
              </span>
            </div>
          </div>
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

  if (toolName === 'listPurchaseOrders') {
    return (
      <div className="space-y-4">
        {result?.map((po: any, index: number) => (
          <div
            key={po.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header with PO Number and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
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
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {po.poNumber}
                  </h3>
                  {po.reference && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ref: {po.reference}</p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
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
            </div>

            {/* Supplier Information */}
            {po.supplier?.id && (
              <div className="mb-4 p-3 bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg">
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supplier
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-mono text-xs">
                  ID: {po.supplier.id}
                </p>
              </div>
            )}

            {/* Dates and Financial Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            </div>

            {/* Financial Breakdown */}
            <div className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
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
            </div>

            {/* Line Items */}
            {po.lineItems && po.lineItems.length > 0 && (
              <div className="mb-4">
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
              </div>
            )}

            {/* Shipping Address */}
            {po.shippingAddress && (
              <div className="mb-4">
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
                <div className="bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3">
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
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {new Date(po.updatedAt).toLocaleDateString()}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                ID: {po.id.slice(0, 8)}...
              </span>
            </div>
          </div>
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

  if (toolName === 'getBalanceSheet') {
    const report = result?.reports?.[0]
    if (!report) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No balance sheet data available</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {report.reportName}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>End Date: {new Date(report.endDate).toLocaleDateString()}</span>
            <span>Currency: {report.currency}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Net Assets: {report.currency} {report.netAssets?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Assets */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Assets
            </h4>
            <div className="text-right mb-3">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {report.currency} {report.assets?.value?.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              {report.assets?.items?.map((category: any, catIndex: number) => (
                <div
                  key={catIndex}
                  className="border-l-2 border-green-200 dark:border-green-800 pl-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {report.currency} {category.value?.toLocaleString()}
                    </span>
                  </div>
                  {category.items && category.items.length > 0 && (
                    <div className="ml-2 space-y-1">
                      {category.items.slice(0, 3).map((account: any, accIndex: number) => (
                        <div
                          key={accIndex}
                          className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span>{account.name}</span>
                          <span>
                            {report.currency} {account.value?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {category.items.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          + {category.items.length - 3} more accounts
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Liabilities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h2m8-4V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0V7a2 2 0 012-2h2"
                />
              </svg>
              Liabilities
            </h4>
            <div className="text-right mb-3">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {report.currency} {report.liabilities?.value?.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              {report.liabilities?.items?.map((category: any, catIndex: number) => (
                <div key={catIndex} className="border-l-2 border-red-200 dark:border-red-800 pl-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {report.currency} {category.value?.toLocaleString()}
                    </span>
                  </div>
                  {category.items && category.items.length > 0 && (
                    <div className="ml-2 space-y-1">
                      {category.items.slice(0, 3).map((account: any, accIndex: number) => (
                        <div
                          key={accIndex}
                          className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span>{account.name}</span>
                          <span>
                            {report.currency} {account.value?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {category.items.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          + {category.items.length - 3} more accounts
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Equity
            </h4>
            <div className="text-right mb-3">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {report.currency} {report.equity?.value?.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              {report.equity?.items?.map((account: any, accIndex: number) => (
                <div
                  key={accIndex}
                  className="border-l-2 border-blue-200 dark:border-blue-800 pl-3"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 dark:text-white">{account.name}</span>
                    <span className="text-gray-900 dark:text-white">
                      {report.currency} {account.value?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Add similar implementations for other tool types with staggered animations...
  // Keeping concise for now, but you can apply the same pattern

  // Fallback for other tools (simplified for brevity)
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300">
        {toolName} Results:
      </h4>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm border border-gray-200 dark:border-gray-700">
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Example prompts for empty state
const EXAMPLE_PROMPTS = [
  'List my last 5 customers',
  'Show recent invoices',
  'Get my expenses this month',
  'Show balance sheet report',
  'List payment history',
  'Get chart of accounts'
]

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-3 p-4">
      <div className="flex items-center space-x-2">
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>

        {/* AI avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">AI is working...</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Fetching your accounting data
        </div>
      </div>
    </div>
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { session } = useSession()
  const { connection } = useConnections()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    body: {
      jwt: session?.jwt,
      serviceId: connection?.serviceId
    }
  })

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  // Handle example prompt clicks
  const handleExampleClick = (prompt: string) => {
    // Simulate typing the prompt
    const event = {
      target: { value: prompt }
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(event)

    // Auto submit after a short delay
    setTimeout(() => {
      const submitEvent = new Event('submit') as any
      submitEvent.preventDefault = () => {
        /* handled by useChat */
      }
      handleSubmit(submitEvent)
    }, 100)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 rounded-full shadow-xl transition-all duration-300 ease-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-500/50 flex items-center justify-center ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700 rotate-180'
            : 'bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg
            className="w-8 h-8 text-white transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-white transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}

        {/* Notification dot for unread messages */}
        {!isOpen && messages.length > 0 && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {messages.filter((m) => m.role === 'assistant').length}
            </span>
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[600px] h-700px] xl:w-[660px] xl:h-[780px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-out transform scale-100 origin-bottom-right animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="p-5 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-primary-100 text-sm">
                  {connection ? `Connected to ${connection.name}` : 'Not connected'}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <img
                  src={connection?.icon || connection?.logo}
                  alt="Apideck Logo"
                  className="w-10 h-10"
                />
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50 h-full">
            {messages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
                <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    Ask me anything!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    I can help you with your accounting data
                  </p>
                </div>

                <div className="space-y-4 w-full">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Try these examples:
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                    {EXAMPLE_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(prompt)}
                        className="text-left p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <span className="text-primary-500 mr-2">✨</span>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Messages */
              <>
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-in slide-in-from-bottom-2 w-full`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                          : message.toolInvocations && message.toolInvocations.length > 0
                          ? ''
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {/* Show regular message content if it exists */}
                      {message.content && (
                        <div
                          className={`text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert ${
                            message.role === 'user' ? 'text-white' : ''
                          }`}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}

                      {/* Show tool invocation results */}
                      {message.toolInvocations && message.toolInvocations.length > 0 && (
                        <div className={message.content ? 'mt-3' : ''}>
                          {message.toolInvocations.map((toolInvocation: any, toolIndex: number) => (
                            <ToolResultRenderer
                              key={`${message.id}-tool-${toolIndex}`}
                              toolInvocation={toolInvocation}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {status === 'streaming' && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 max-w-[85%]">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  disabled={status !== 'ready'}
                  placeholder="Ask about customers, invoices, expenses..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={status !== 'ready' || !input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {status === 'streaming'
                    ? 'AI is responding...'
                    : status === 'ready'
                    ? 'Ready to help'
                    : 'Connecting...'}
                </span>
                <span className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      status === 'ready'
                        ? 'bg-green-400'
                        : status === 'streaming'
                        ? 'bg-blue-400 animate-pulse'
                        : 'bg-gray-400'
                    }`}
                  ></div>
                  {connection?.name || 'Not connected'}
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
