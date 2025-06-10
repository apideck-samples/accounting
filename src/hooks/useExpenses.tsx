import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { usePrevious } from '@apideck/components'
import { Expense } from '@apideck/unify/models/components'
import { fetcher } from 'utils'

export const useExpenses = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()

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
      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        return {
          error: responseData || {
            message: 'Failed to delete expense',
            detail: { message: response.statusText || 'Server error' }
          }
        }
      }
      return { success: true, data: responseData }
    } catch (err: any) {
      console.error('Network or other error in removeExpense:', err)
      return {
        error: {
          message: 'Network error while deleting expense',
          detail: { message: err.message || 'Could not connect to server' }
        }
      }
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
    if (responseData && responseData.success) {
      mutate(getExpensesUrl)
    }
    return responseData
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
    error: apiError || swrError,
    hasNextPage: !!data?.getExpensesResponse?.meta?.cursors?.next,
    currentPage: data?.getExpensesResponse?.meta?.cursors?.current,
    hasPrevPage: !!data?.getExpensesResponse?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createExpense,
    deleteExpense
  }
}
