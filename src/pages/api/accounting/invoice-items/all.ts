import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
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
    const response = await apideck.accounting.invoiceItems.list({
      limit: 200,
      serviceId: serviceId,
      cursor: cursor as string | undefined
    })
    res.json(response)
  } catch (error: unknown) {
    console.error('[API Invoice Items All] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}

export default withProtection(handler, { requireServiceId: true })
