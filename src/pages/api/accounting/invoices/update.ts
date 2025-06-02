import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
// We might need InvoiceInput type if we want to validate/type the payload explicitly
// import { InvoiceInput } from '@apideck/unify/models/components';

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

  let requestPayload: { id?: string; invoice?: any } // Type for invoice should be InvoiceInput
  try {
    requestPayload = typeof body === 'string' ? JSON.parse(body) : body
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  const { id, invoice } = requestPayload

  if (!id) {
    return res.status(400).json({ message: 'Invoice ID (id) is required in the body' })
  }
  if (!invoice) {
    return res.status(400).json({ message: 'Invoice data (invoice) is required in the body' })
  }

  try {
    const apideck = init(jwt as string)
    // New method is likely invoices.update()
    // The payload for update usually includes the id in the path and the data in the body.
    // The SDK likely expects { id: string, invoice: InvoiceInputType, serviceId: string }
    const result = await apideck.accounting.invoices.update({
      id: id,
      invoice: invoice, // This should be of type InvoiceInput from new SDK
      serviceId: serviceId
    })
    res.json(result) // This will be UpdateInvoiceResponse or similar from SDK
  } catch (error: unknown) {
    console.error('[API Invoices Update] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
