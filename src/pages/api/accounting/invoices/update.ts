import { InvoiceInput } from '@apideck/unify/models/components'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'

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

  let requestPayload: { id?: string; invoice?: InvoiceInput } // Type for invoice should be InvoiceInput
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

    const result = await apideck.accounting.invoices.update({
      id,
      invoice,
      serviceId
    })
    res.json(result)
  } catch (error: unknown) {
    console.error('[API Invoices Update] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
