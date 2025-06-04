import { Button, Chip } from '@apideck/components'
import { useExpenses, useSession } from 'hooks'
import { HiExclamation, HiOutlineDocumentSearch } from 'react-icons/hi'

import type { Expense } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import SlideOver from 'components/SlideOver'
import { useEffect, useState } from 'react'
import ExpenseDetails from './ExpenseDetails'
import ExpensesTableLoadingRow from './ExpensesTableLoadingRow'

const ExpensesTable = () => {
  const { expenses, error, isLoading, hasNextPage, hasPrevPage, nextPage, prevPage } = useExpenses()

  const [selectedExpense, setSelectedExpense] = useState<null | Expense>(null)
  const [vaultOpen, setVaultOpen] = useState(false)
  const { session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (vaultOpen && session?.jwt) {
      ApideckVault.open({
        token: session.jwt as string,
        showAttribution: true,
        unifiedApi: 'accounting',
        onClose: () => setVaultOpen(false)
      })
    }
  }, [vaultOpen, session])

  const createdOrUpdatedAtText =
    expenses && expenses.length > 0 && expenses[0]?.createdAt ? 'Created at' : 'Updated at'
  const showTypeColumn = expenses && expenses.length > 0 && expenses[0]?.type

  return (
    <div className="sm:px-4 md:px-0">
      <div className="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 sm:rounded-lg fade-up">
        {/* Expense Table */}
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 ">
                <span className="whitespace-nowrap">Number</span>
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6"
              >
                Customer/Supplier
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-medium text-gray-900 sm:table-cell"
              >
                <span className="whitespace-nowrap">Payment Type</span>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                {createdOrUpdatedAtText}
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                Transaction Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                Total
              </th>
              {showTypeColumn && (
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 "
                >
                  <span className="whitespace-nowrap">Type</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {expenses?.map((expense: Expense) => {
              const currency = expense?.currency?.toString() || 'USD'
              const createdOrUpdatedAtValue = expense.createdAt || expense.updatedAt
              const transactionDateValue = expense.transactionDate

              return (
                <tr
                  key={expense.id}
                  className="cursor-pointer hover:bg-gray-50 overflow-visible fade-in"
                  onClick={() => {
                    setSelectedExpense(expense)
                    setIsOpen(true)
                  }}
                >
                  <td className="px-3 py-4 text-sm text-gray-900 truncate">{expense.number}</td>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm  text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    <div className="flex-1 truncate hidden sm:block">
                      <h3 className="text-gray-800 text-sm truncate text-left">
                        {expense.customerId || expense.supplierId || 'N/A'}
                      </h3>
                    </div>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate max-w-xs">
                    {expense.paymentType}
                  </td>
                  <td className="px-3 py-4 text-sm truncate">
                    <div className=" text-gray-800">
                      {createdOrUpdatedAtValue &&
                        new Date(createdOrUpdatedAtValue).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500">
                      {createdOrUpdatedAtValue &&
                        new Date(createdOrUpdatedAtValue).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm truncate">
                    <div className=" text-gray-800">
                      {transactionDateValue &&
                        new Date(transactionDateValue as unknown as string).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 py-4 font-medium text-gray-900  min-w-md">
                    {expense.totalAmount &&
                      new Intl.NumberFormat(currency, {
                        style: 'currency',
                        currency: currency
                      }).format(expense.totalAmount)}
                  </td>
                  {expense.type && (
                    <td className="px-3 py-4 text-sm text-gray-500 truncate">
                      <span className="">
                        <Chip
                          size="small"
                          className="uppercase"
                          colorClassName={
                            expense.type.toString() === 'expense'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                          label={expense.type.toString()}
                        />
                      </span>
                    </td>
                  )}
                  <td className="py-4 text-center text-sm font-medium"></td>
                </tr>
              )
            })}
            {isLoading &&
              [...new Array(10).keys()]?.map((i: number) => {
                return <ExpensesTableLoadingRow key={i} />
              })}
          </tbody>
        </table>

        {/* Empty State */}
        {expenses && expenses.length === 0 && !isLoading && (
          <div
            className="text-center bg-white py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentSearch className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
          </div>
        )}

        {error && (
          <div
            className="text-center bg-white py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiExclamation className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {(error as any)?.message || JSON.stringify(error)}
            </h3>
            {(error as any)?.message === 'Unauthorized' && (
              <>
                <p className="mt-1 mb-3">Please first connect with at least one service</p>
                <Button text="Authorize integration" onClick={() => setVaultOpen(true)} />
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        {((expenses && expenses.length > 0) || isLoading) && (
          <div className="flex flex-row-reverse py-4 border-gray-200 px-4 border-t">
            {hasNextPage && (
              <Button onClick={nextPage} text="Next" className="ml-2" isLoading={isLoading} />
            )}
            {hasPrevPage && (
              <Button
                onClick={prevPage}
                text="Previous"
                variant="secondary"
                isLoading={isLoading}
              />
            )}
            {isLoading && <Button disabled={true} text="Loading" isLoading={isLoading} />}
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isOpen}
        title={`Expense ${selectedExpense?.number}`}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        {selectedExpense && (
          <ExpenseDetails
            expense={selectedExpense}
            onClose={() => {
              setIsOpen(false)
            }}
          />
        )}
      </SlideOver>
    </div>
  )
}

export default ExpensesTable
