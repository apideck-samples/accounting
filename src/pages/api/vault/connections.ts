import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../_utils'

interface Params {
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt }: Params = req.query

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }

  try {
    const apideck = init(jwt as string)
    const result = await apideck.vault.connections.list({ api: 'accounting' })
    res.json(result)
  } catch (error: unknown) {
    console.error('[API Vault Connections] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
