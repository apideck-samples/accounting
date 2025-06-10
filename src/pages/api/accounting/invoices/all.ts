import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

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
    console.log('[Invoices API - Raw SDK List Response]:', JSON.stringify(response, null, 2))
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to fetch invoices')
  }
}
