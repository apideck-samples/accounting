import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { withProtection } from '../../_utils/with-protection'

interface Body {
  id?: string
}

async function handler(
  req: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) {
  const { jwt, serviceId } = context
  const { body } = req

  let parsedBody: Body
  try {
    parsedBody = typeof body === 'string' ? JSON.parse(body) : body
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  const { id } = parsedBody

  if (!id) {
    return res.status(400).json({ message: 'Customer ID (id) is required in the body' })
  }

  try {
    const apideck = init(jwt)
    const result = await apideck.accounting.customers.delete({
      serviceId: serviceId,
      id: id
    })
    if (result && (result as any).statusCode === 204) {
      return res.status(204).end()
    }
    res.json(result)
  } catch (error: unknown) {
    console.error('[API Customers Delete] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}

export default withProtection(handler, { requireServiceId: true, requireBody: true })
