import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { usePrevious, useToast } from '@apideck/components'
import { Supplier } from '@apideck/unify/models/components' // Import Supplier type
import { fetcher } from 'utils'

// Re-defining these interfaces here for now. Consider moving to a shared types file if used across many hooks.
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
  [key: string]: any
}

interface ApiErrorResponse {
  message: string
  detail?: ApiErrorDetail
}

export const useSuppliers = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()
  const { addToast } = useToast()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getSuppliersUrl = serviceId
    ? `/api/accounting/suppliers/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data, error: swrError } = useSWR(getSuppliersUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  // Helper to parse error for toast (similar to useExpenses)
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
      } else if (errorData.detail.error?.Message) {
        // For nested Xero-like messages
        description = errorData.detail.error.Message
      }
    }
    if (
      title === defaultTitle &&
      description === 'An unexpected error occurred. Please try again.' &&
      swrError?.message
    ) {
      description = swrError.message
    }
    return { title, description }
  }

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      const response = await fetch(
        `/api/accounting/suppliers/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify(supplier)
        }
      )
      const responseData = await response.json()
      if (!response.ok) {
        return {
          error: responseData || {
            message: 'Failed to create supplier',
            detail: { message: response.statusText }
          }
        }
      }
      return responseData?.createSupplierResponse?.data
    } catch (err: any) {
      console.error('Network or other error in addSupplier:', err)
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' }
        }
      }
    }
  }

  const removeSupplier = async (id: string) => {
    try {
      const response = await fetch(
        `/api/accounting/suppliers/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify({ id })
        }
      )
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}))
        const { title, description } = parseErrorForToast(errorData, 'Failed to delete supplier')
        addToast({ title, description, type: 'error' })
        return null
      }
      addToast({ title: 'Supplier deleted successfully', type: 'success' })
      return response.json()
    } catch (err: any) {
      console.error('Network or other error in removeSupplier:', err)
      const { title, description } = parseErrorForToast(err, 'Failed to delete supplier')
      addToast({ title, description, type: 'error' })
      return null
    }
  }

  const createSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    const responseData = await addSupplier(supplier)
    if (responseData && !responseData.error) {
      mutate(getSuppliersUrl)
    }
    // Error display/toast is now fully handled by the form via the returned error object
    return responseData
  }

  const deleteSupplier = async (id: string) => {
    const responseData = await removeSupplier(id)
    if (responseData) {
      // removeSupplier returns null on error after showing toast
      mutate(getSuppliersUrl)
    }
    return responseData
  }

  const nextPage = () => {
    const nextCursor = data?.getSuppliersResponse?.meta?.cursors?.next // Adjusted for potential supplier response structure
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = data?.getSuppliersResponse?.meta?.cursors?.previous
    setCursor(prevCursor)
  }

  // Assuming the list response for suppliers will be nested under getSuppliersResponse like others
  const apiSpecificError = data?.getSuppliersResponse?.error
  const isLoadingState = !swrError && !data && !!getSuppliersUrl

  return {
    suppliers: data?.getSuppliersResponse?.data as Supplier[] | undefined,
    isLoading: isLoadingState,
    error: apiSpecificError || swrError,
    hasNextPage: !!data?.getSuppliersResponse?.meta?.cursors?.next,
    currentPage: data?.getSuppliersResponse?.meta?.cursors?.current,
    hasPrevPage: !!data?.getSuppliersResponse?.meta?.cursors?.previous,
    nextPage,
    prevPage,
    createSupplier,
    deleteSupplier
  }
}
