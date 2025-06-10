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
  const { cursor } = req.query

  try {
    const apideck = init(jwt)
    const response = await apideck.accounting.ledgerAccounts.list({
      limit: 200, // Fetch a larger list for selection, default is often 20
      serviceId: serviceId,
      cursor: cursor as string | undefined
      // filters could be added here, e.g. to fetch only specific account types
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to fetch ledger accounts')
  }
}

export default withProtection(handler, { requireServiceId: true })
