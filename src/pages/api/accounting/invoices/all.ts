import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId, cursor }: Params = req.query

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }

  try {
    const apideck = init(jwt as string)
    const response = await apideck.accounting.invoices.list({
      limit: 10,
      serviceId: serviceId,
      cursor: cursor
    })
    res.json(response)
  } catch (error: unknown) {
    console.error('[API Invoices All] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
