import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { usePrevious } from '@apideck/components'
import { PurchaseOrder } from '@apideck/unify/models/components'
import { fetcher } from 'utils'

// Define a type for the payload coming from the form, which uses native Date objects
type PurchaseOrderFormPayload = Omit<
  PurchaseOrder,
  'id' | 'issuedDate' | 'deliveryDate' | 'expectedArrivalDate' | 'dueDate'
> & {
  issuedDate?: Date
  deliveryDate?: Date
  expectedArrivalDate?: Date
  dueDate?: Date
}

export const usePurchaseOrders = () => {
  const [cursor, setCursor] = useState<string | null | undefined>(null)
  const { connection } = useConnections()
  const { session } = useSession()
  const serviceId = connection?.serviceId || ''
  const prevServiceId = usePrevious(serviceId)
  const { mutate } = useSWRConfig()

  const hasNewCursor = cursor && (!prevServiceId || prevServiceId === serviceId)
  const cursorParams = hasNewCursor ? `&cursor=${cursor}` : ''
  const getPurchaseOrdersUrl = serviceId
    ? `/api/accounting/purchase-orders/all?jwt=${session?.jwt}&serviceId=${serviceId}${cursorParams}`
    : null

  const { data: swrData, error: swrError } = useSWR(getPurchaseOrdersUrl, fetcher)

  useEffect(() => {
    if (prevServiceId && prevServiceId !== serviceId) {
      setCursor(null)
    }
  }, [serviceId, prevServiceId])

  const addPurchaseOrder = async (purchaseOrder: PurchaseOrderFormPayload) => {
    try {
      const response = await fetch(
        `/api/accounting/purchase-orders/add?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify(purchaseOrder)
        }
      )
      const responseData = await response.json()
      if (!response.ok) {
        return {
          error: responseData || {
            message: 'Failed to create purchase order',
            detail: { message: response.statusText }
          }
        }
      }
      return responseData
    } catch (err: any) {
      console.error('Network or other error in addPurchaseOrder:', err)
      return {
        error: {
          message: 'Network error',
          detail: { message: err.message || 'Could not connect to server' }
        }
      }
    }
  }

  const removePurchaseOrder = async (id: string) => {
    try {
      const response = await fetch(
        `/api/accounting/purchase-orders/delete?jwt=${session?.jwt}&serviceId=${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify({ id })
        }
      )
      const responseData = await response.json().catch(() => ({}))
      if (!response.ok) {
        return {
          error: responseData || {
            message: 'Failed to delete purchase order',
            detail: { message: response.statusText || 'Server error' }
          }
        }
      }
      return { success: true, data: responseData }
    } catch (err: any) {
      console.error('Network or other error in removePurchaseOrder:', err)
      return {
        error: {
          message: 'Network error while deleting purchase order',
          detail: { message: err.message || 'Could not connect to server' }
        }
      }
    }
  }

  const createPurchaseOrder = async (purchaseOrder: PurchaseOrderFormPayload) => {
    const responseData = await addPurchaseOrder(purchaseOrder)
    if (responseData && !responseData.error) {
      mutate(getPurchaseOrdersUrl)
    }
    return responseData
  }

  const deletePurchaseOrder = async (id: string) => {
    const responseData = await removePurchaseOrder(id)
    if (responseData && responseData.success) {
      mutate(getPurchaseOrdersUrl)
    }
    return responseData
  }

  // Robustly access nested data and meta from the SWR response
  const responseData = swrData?.getPurchaseOrdersResponse || swrData
  const purchaseOrders = responseData?.data as PurchaseOrder[] | undefined
  const meta = responseData?.meta

  const nextPage = () => {
    const nextCursor = meta?.cursors?.next
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  const prevPage = () => {
    const prevCursor = meta?.cursors?.previous
    if (prevCursor) {
      setCursor(prevCursor)
    }
  }

  const apiError = responseData?.error || swrData?.error
  const isLoadingState = !swrError && !swrData && !!getPurchaseOrdersUrl

  return {
    purchaseOrders,
    isLoading: isLoadingState,
    error: apiError || swrError,
    hasNextPage: !!meta?.cursors?.next,
    currentPage: meta?.cursors?.current,
    hasPrevPage: !!meta?.cursors?.previous,
    nextPage,
    prevPage,
    createPurchaseOrder,
    deletePurchaseOrder
  }
}
