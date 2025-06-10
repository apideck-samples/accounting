import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'

import { InvoiceItemInput } from '@apideck/unify/models/components'
import { withProtection } from '../../_utils/with-protection'

async function handler(
  req: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) {
  const { jwt, serviceId } = context
  const { body } = req
  let invoiceItemPayload: InvoiceItemInput
  try {
    invoiceItemPayload = typeof body === 'string' ? JSON.parse(body) : body
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  try {
    const apideck = init(jwt)
    const response = await apideck.accounting.invoiceItems.create({
      serviceId: serviceId,
      invoiceItem: invoiceItemPayload
    })

    if (response.createInvoiceItemResponse?.data) {
      res.json(response.createInvoiceItemResponse.data)
    } else {
      console.warn('[API Invoice Items Add] SDK returned success but no item data:', response)
      res.status(200).json(response)
    }
  } catch (error: unknown) {
    console.error('[API Invoice Items Add] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}

export default withProtection(handler, { requireServiceId: true, requireBody: true })
