import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../_utils'
import { withProtection } from '../_utils/with-protection'

async function handler(
  _: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) {
  const { jwt } = context
  try {
    const apideck = init(jwt)
    const result = await apideck.vault.connections.list({ api: 'accounting' })
    res.json(result)
  } catch (error: unknown) {
    console.error('[API Vault Connections] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}

export default withProtection(handler)
