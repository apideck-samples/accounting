import type { VercelRequest, VercelResponse } from '@vercel/node'

import type { GetProfitAndLossResponse } from '@apideck/node'
import { init } from '../_utils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string

  'filter[start_date]'?: string
  'filter[end_date]'?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId }: Params = req.query
  const start_date = req.query['filter[start_date]'] as string
  const end_date = req.query['filter[end_date]'] as string
  const filter = start_date ? { start_date, end_date } : {}

  const apideck = init(jwt as string)

  try {
    const response: GetProfitAndLossResponse = await apideck.accounting.profitAndLossOne({
      serviceId,
      filter
    })
    res.json(response)
  } catch (error: any) {
    const response = await error.json()
    res.status(500).json(response)
  }
}
