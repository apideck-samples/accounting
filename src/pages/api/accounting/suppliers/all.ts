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
    const response = await apideck.accounting.suppliers.list({
      serviceId,
      cursor: cursor as string | undefined
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to fetch suppliers')
  }
}

export default withProtection(handler, { requireServiceId: true })
