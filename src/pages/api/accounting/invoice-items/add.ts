import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
// import { CreateInvoiceItemResponse } from '@apideck/node' // Old import
// We might need InvoiceItemInput for explicit typing of the payload
// import { InvoiceItemInput } from '@apideck/unify/models/components';

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

  let invoiceItemPayload: any // Should be typed as InvoiceItemInput
  try {
    invoiceItemPayload = typeof body === 'string' ? JSON.parse(body) : body
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  try {
    const apideck = init(jwt as string)
    // New method is invoiceItems.create(), payload is { serviceId, invoiceItem: InvoiceItemInput }
    const response = await apideck.accounting.invoiceItems.create({
      serviceId: serviceId,
      invoiceItem: invoiceItemPayload // This should be of type InvoiceItemInput
    })
    // The response from SDK (AccountingInvoiceItemsAddResponse) contains createInvoiceItemResponse.data for the created item
    if (response.createInvoiceItemResponse?.data) {
      res.json(response.createInvoiceItemResponse.data) // Return the created invoice item directly
    } else {
      // This case implies success from SDK (2xx) but unexpected structure or no data.
      console.warn('[API Invoice Items Add] SDK returned success but no item data:', response)
      res.status(200).json(response) // Return the full SDK response for client to inspect
    }
  } catch (error: unknown) {
    console.error('[API Invoice Items Add] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
