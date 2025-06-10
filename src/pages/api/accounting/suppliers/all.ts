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
    // Based on the docs, the list operation might take filter, sort, passThrough, fields options.
    // For a basic list, we'll use limit and cursor similar to other resources.
    const response = await apideck.accounting.suppliers.list({
      limit: 20, // Default limit in docs is 20
      serviceId: serviceId,
      cursor: cursor
      // TODO: Add options for filter, sort, passThrough, fields in the future if needed
    })
    console.log('[Suppliers API - Raw SDK List Response]:', JSON.stringify(response, null, 2))
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to fetch suppliers')
  }
}
