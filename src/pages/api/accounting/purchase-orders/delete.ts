import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let idFromBody: string | undefined
  try {
    if (req.body) {
      const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      idFromBody = parsedBody.id
    }
  } catch (e) {
    console.error('[API PurchaseOrders Delete] Failed to parse body:', e)
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  const { jwt, serviceId }: Params = req.query
  console.log(
    `[API PurchaseOrders Delete] Received request to delete ID: ${idFromBody} for serviceId: ${serviceId}`
  )

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }
  if (!idFromBody) {
    return res.status(400).json({ message: 'Purchase Order ID is required in the request body' })
  }

  try {
    const apideck = init(jwt as string)
    const result = await apideck.accounting.purchaseOrders.delete({ serviceId, id: idFromBody })
    res.status(200).json(result)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to delete purchase order')
  }
}
