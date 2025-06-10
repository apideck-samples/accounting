import { usePrevious, useToast } from '@apideck/components'
import { CreditNote, CreditNoteInput } from '@apideck/unify/models/components'
import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { fetcher } from 'utils'

interface ApiErrorResponse {
  message: string
  detail?: any
}

export const useCreditNotes = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()
  const { addToast } = useToast()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getCreditNotesUrl = serviceId
    ? `/api/accounting/credit-notes/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data, error: swrError } = useSWR(getCreditNotesUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const createCreditNote = async (creditNote: CreditNoteInput) => {
    try {
      const response = await fetch(
        `/api/accounting/credit-notes/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify(creditNote)
        }
      )
      const responseData = await response.json()
      if (!response.ok) {
        return { error: responseData }
      }
      mutate(getCreditNotesUrl)
      return responseData?.createCreditNoteResponse?.data
    } catch (err: any) {
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' }
        }
      }
    }
  }

  const deleteCreditNote = async (id: string) => {
    try {
      const response = await fetch(
        `/api/accounting/credit-notes/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify({ id })
        }
      )
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}))
        addToast({
          title: 'Failed to delete credit note',
          description: errorData?.detail?.message || errorData.message,
          type: 'error'
        })
        return { success: false, error: errorData }
      }
      mutate(getCreditNotesUrl)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  const nextPage = () => {
    const nextCursor = data?.getCreditNotesResponse?.meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.getCreditNotesResponse?.meta?.cursors?.previous
    setCursor(prevCursor)
  }

  const apiSpecificError = data?.getCreditNotesResponse?.error
  const isLoadingState = !swrError && !data && !!getCreditNotesUrl

  return {
    creditNotes: data?.getCreditNotesResponse?.data as CreditNote[] | undefined,
    isLoading: isLoadingState,
    error: apiSpecificError || swrError,
    hasNextPage: !!data?.getCreditNotesResponse?.meta?.cursors?.next,
    hasPrevPage: !!data?.getCreditNotesResponse?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createCreditNote,
    deleteCreditNote
  }
}
