import { PurchaseOrderInput } from '@apideck/unify/models/components'
import { RFCDate } from '@apideck/unify/types'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req
  const { jwt, serviceId }: Params = query

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }
  if (!body) {
    return res.status(400).json({ message: 'Request body is required' })
  }

  try {
    const apideck = init(jwt as string)
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body

    // The client sends full ISO strings for dates. RFCDate constructor expects 'YYYY-MM-DD'.
    // We must slice the string before passing it to the constructor.
    const purchaseOrderForSDK: PurchaseOrderInput = {
      ...parsedBody,
      issuedDate: parsedBody.issuedDate
        ? new RFCDate((parsedBody.issuedDate as string).substring(0, 10))
        : undefined,
      deliveryDate: parsedBody.deliveryDate
        ? new RFCDate((parsedBody.deliveryDate as string).substring(0, 10))
        : undefined,
      expectedArrivalDate: parsedBody.expectedArrivalDate
        ? new RFCDate((parsedBody.expectedArrivalDate as string).substring(0, 10))
        : undefined,
      dueDate: parsedBody.dueDate
        ? new RFCDate((parsedBody.dueDate as string).substring(0, 10))
        : undefined
    }

    const response = await apideck.accounting.purchaseOrders.create({
      serviceId,
      purchaseOrder: purchaseOrderForSDK
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to create purchase order')
  }
}
