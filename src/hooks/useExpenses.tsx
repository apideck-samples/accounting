import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { usePrevious, useToast } from '@apideck/components'
import { Expense } from '@apideck/unify/models/components'
import { fetcher } from 'utils'

interface ApiErrorDetail {
  name?: string
  message?: string
  issues?: Array<{
    path: string[]
    message: string
    code?: string
    expected?: string
    received?: string
  }>
  cause?: any
  [key: string]: any // Allow other properties
}

interface ApiErrorResponse {
  message: string
  detail?: ApiErrorDetail
}

export const useExpenses = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()
  const { addToast } = useToast()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getExpensesUrl = serviceId
    ? `/api/accounting/expenses/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data, error: swrError } = useSWR(getExpensesUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const parseErrorForToast = (errorData: ApiErrorResponse | any, defaultTitle: string) => {
    let title = defaultTitle
    let description = 'An unexpected error occurred. Please try again.'

    if (errorData?.message) {
      title = errorData.message
    }

    if (errorData?.detail) {
      if (errorData.detail.name === 'SDKValidationError' && errorData.detail.issues?.length) {
        description = errorData.detail.issues
          .map(
            (issue: { path: string[]; message: string }) =>
              `${issue.path.join('.')}: ${issue.message}`
          )
          .join('\n')
      } else if (typeof errorData.detail === 'object' && errorData.detail.message) {
        description = errorData.detail.message
      } else if (typeof errorData.detail === 'string') {
        description = errorData.detail
      }
    }
    // If the description is still the generic one and title is also generic, use SWR error message if available
    if (
      title === defaultTitle &&
      description === 'An unexpected error occurred. Please try again.' &&
      swrError?.message
    ) {
      description = swrError.message
    }

    return { title, description }
  }

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const response = await fetch(
        `/api/accounting/expenses/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify(expense)
        }
      )
      const responseData = await response.json()

      if (!response.ok) {
        console.log('responseData', responseData)
        return {
          error: responseData || {
            message: 'Failed to create expense',
            detail: { message: response.statusText }
          }
        }
      }
      return responseData
    } catch (err: any) {
      console.error('Network or other error in addExpense:', err)
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' }
        }
      }
    }
  }

  const removeExpense = async (id: string) => {
    try {
      const response = await fetch(
        `/api/accounting/expenses/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify({ id })
        }
      )
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}))
        const { title, description } = parseErrorForToast(errorData, 'Failed to delete expense')
        addToast({ title, description, type: 'error' })
        return null
      }
      addToast({ title: 'Expense deleted successfully', type: 'success' })
      return response.json()
    } catch (err) {
      console.error('Network or other error in removeExpense:', err)
      const { title, description } = parseErrorForToast(err, 'Failed to delete expense')
      addToast({ title, description, type: 'error' })
      return null
    }
  }

  const createExpense = async (expense: Omit<Expense, 'id'>) => {
    const responseData = await addExpense(expense)
    if (responseData && !responseData.error) {
      mutate(getExpensesUrl)
    }
    return responseData
  }

  const deleteExpense = async (id: string) => {
    const responseData = await removeExpense(id)
    if (responseData) {
      mutate(getExpensesUrl)
      return responseData
    }
    return null
  }

  const nextPage = () => {
    const nextCursor = data?.getExpensesResponse?.meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.getExpensesResponse?.meta?.cursors?.previous
    setCursor(prevCursor)
  }

  const apiError = data?.getExpensesResponse?.error
  const isLoadingState = !swrError && !data && !!getExpensesUrl

  return {
    expenses: data?.getExpensesResponse?.data as Expense[] | undefined,
    isLoading: isLoadingState,
    error: apiError || swrError, // Combine SWR error with API specific error if any
    hasNextPage: !!data?.getExpensesResponse?.meta?.cursors?.next,
    currentPage: data?.getExpensesResponse?.meta?.cursors?.current,
    hasPrevPage: !!data?.getExpensesResponse?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createExpense,
    deleteExpense
  }
}
