import { PurchaseOrderInput } from '@apideck/unify/models/components'
import { RFCDate } from '@apideck/unify/types'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'
import { withProtection } from '../../_utils/with-protection'

async function handler(
  req: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) {
  const { jwt, serviceId } = context
  const { body } = req

  try {
    const apideck = init(jwt)
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

export default withProtection(handler, { requireServiceId: true, requireBody: true })
