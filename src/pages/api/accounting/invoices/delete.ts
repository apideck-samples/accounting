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

  let idFromBody: string | undefined
  try {
    if (req.body) {
      const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      idFromBody = parsedBody.id
    }
  } catch (e) {
    console.error('[API Invoices Delete] Failed to parse body:', e)
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  if (!idFromBody) {
    console.error('[API Invoices Delete] Invoice ID missing in body')
    return res.status(400).json({ message: 'Invoice ID (id) is required in the request body' })
  }

  try {
    const apideck = init(jwt)
    const result = await apideck.accounting.invoices.delete({ serviceId, id: idFromBody })
    res.status(200).json(result)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to delete invoice')
  }
}

export default withProtection(handler, { requireServiceId: true, requireBody: true })
