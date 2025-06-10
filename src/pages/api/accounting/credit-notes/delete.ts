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
  const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

  if (!id) {
    return res.status(400).json({ message: 'Credit Note ID is required in the request body' })
  }

  try {
    const apideck = init(jwt)
    const result = await apideck.accounting.creditNotes.delete({ serviceId, id })
    res.status(200).json(result)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to delete credit note')
  }
}

export default withProtection(handler, { requireServiceId: true, requireBody: true })
