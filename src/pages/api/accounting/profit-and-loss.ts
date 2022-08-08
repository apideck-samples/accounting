import type { VercelRequest, VercelResponse } from '@vercel/node'

import type { GetProfitAndLossResponse } from '@apideck/node'
import { init } from '../_utils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId }: Params = req.query
  const apideck = init(jwt as string)

  try {
    const response: GetProfitAndLossResponse = await apideck.accounting.profitAndLossOne({
      serviceId
    })
    res.json(response)
  } catch (error: any) {
    const response = await error.json()
    res.status(500).json(response)
  }
}
