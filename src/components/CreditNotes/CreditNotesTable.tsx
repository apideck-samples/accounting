import { Button, Chip } from '@apideck/components'
import { useCreditNotes, useSession } from 'hooks'
import { HiExclamation, HiOutlineDocumentText } from 'react-icons/hi'

import type { CreditNote } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import SlideOver from 'components/SlideOver'
import { useEffect, useState } from 'react'
import CreditNoteDetails from './CreditNoteDetails'
import CreditNotesTableLoadingRow from './CreditNotesTableLoadingRow'

const CreditNotesTable = () => {
  const { creditNotes, error, isLoading, hasNextPage, hasPrevPage, nextPage, prevPage } =
    useCreditNotes()

  const [selectedCreditNote, setSelectedCreditNote] = useState<null | CreditNote>(null)
  const [vaultOpen, setVaultOpen] = useState(false)
  const { session } = useSession()
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

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

  const formatCurrency = (
    amount: number | null | undefined,
    currency: string | null | undefined
  ) => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  return (
    <div className="sm:px-4 md:px-0">
      <div className="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 sm:-mx-6 md:mx-0 sm:rounded-lg fade-up">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
              >
                Number
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell"
              >
                Customer
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
              >
                Date Issued
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Total Amount
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {creditNotes?.map((creditNote: CreditNote) => (
              <tr
                key={creditNote.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 overflow-visible fade-in"
                onClick={() => {
                  setSelectedCreditNote(creditNote)
                  setIsSlideOverOpen(true)
                }}
              >
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:w-auto sm:max-w-none sm:pl-6">
                  {creditNote.number || 'N/A'}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                  {creditNote.customer?.displayName || 'N/A'}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                  {creditNote.dateIssued
                    ? new Date(String(creditNote.dateIssued)).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(creditNote.totalAmount, creditNote.currency)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {creditNote.status && (
                    <Chip
                      label={creditNote.status.toString()}
                      size="small"
                      className="uppercase"
                      colorClassName="bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                    />
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(creditNote.balance, creditNote.currency)}
                </td>
              </tr>
            ))}
            {isLoading &&
              [...new Array(10).keys()].map((i) => <CreditNotesTableLoadingRow key={i} />)}
          </tbody>
        </table>

        {!isLoading && creditNotes && creditNotes.length === 0 && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="empty-state"
          >
            <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No credit notes
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new credit note.
            </p>
          </div>
        )}

        {error && (
          <div
            className="text-center bg-white dark:bg-gray-900 py-10 px-6 rounded fade-in"
            data-testid="error-state"
          >
            <HiExclamation className="mx-auto h-12 w-12 text-red-400 dark:text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
              Failed to load credit notes
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {(error as any)?.message || JSON.stringify(error)}
            </p>
            {(error as any)?.message === 'Unauthorized' && (
              <div className="mt-4">
                <Button
                  text="Authorize Integration"
                  onClick={() => setVaultOpen(true)}
                  variant="danger"
                />
              </div>
            )}
          </div>
        )}

        {((creditNotes && creditNotes.length > 0) || isLoading) && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                onClick={prevPage}
                disabled={!hasPrevPage || isLoading}
                text="Previous"
                variant="outline"
              />
              <Button
                onClick={nextPage}
                disabled={!hasNextPage || isLoading}
                text="Next"
                variant="outline"
              />
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <Button
                    onClick={prevPage}
                    disabled={!hasPrevPage || isLoading}
                    text="Previous"
                    variant="outline"
                    className="relative inline-flex items-center rounded-l-md"
                  />
                  <Button
                    onClick={nextPage}
                    disabled={!hasNextPage || isLoading}
                    text="Next"
                    variant="outline"
                    className="relative inline-flex items-center rounded-r-md"
                  />
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        title={
          selectedCreditNote?.number
            ? `Credit Note #${selectedCreditNote.number}`
            : 'Credit Note Details'
        }
        onClose={() => {
          setIsSlideOverOpen(false)
          setSelectedCreditNote(null)
        }}
      >
        {selectedCreditNote && (
          <CreditNoteDetails
            creditNote={selectedCreditNote}
            onClose={() => {
              setIsSlideOverOpen(false)
              setSelectedCreditNote(null)
            }}
          />
        )}
      </SlideOver>
    </div>
  )
}

export default CreditNotesTable
