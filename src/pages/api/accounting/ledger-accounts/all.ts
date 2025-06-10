import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string
  // Add other potential query params like filters if needed in the future
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
    const response = await apideck.accounting.ledgerAccounts.list({
      limit: 200, // Fetch a larger list for selection, default is often 20
      serviceId: serviceId,
      cursor: cursor
      // filters could be added here, e.g. to fetch only specific account types
    })
    // Add console log for pagination debugging later
    console.log('[LedgerAccounts API - Raw SDK List Response]:', JSON.stringify(response, null, 2))
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to fetch ledger accounts')
  }
}
