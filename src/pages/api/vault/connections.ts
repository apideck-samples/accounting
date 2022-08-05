import { VercelRequest, VercelResponse } from '@vercel/node'

import { GetConnectionsResponse } from '@apideck/node'
import { init } from '../_utils'

interface Params {
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt }: Params = req.query
  const apideck = init(jwt)

  const result: Promise<GetConnectionsResponse> = await apideck.vault
    .connectionsAll({ api: 'accounting' })
    .catch(async (error: Response) => await error.json())

  res.json(result)
}
