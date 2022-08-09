import type { VercelRequest, VercelResponse } from '@vercel/node'

import type { GetBalanceSheetResponse } from '@apideck/node'
import { init } from '../_utils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId }: Params = req.query
  // const filter = {
  //   start_date: req.query['filter[start_date'] as string,
  //   end_date: req.query['filter[end_date'] as string
  // }

  const apideck = init(jwt as string)

  try {
    const response: GetBalanceSheetResponse = await apideck.accounting.balanceSheetOne({
      serviceId
      // filter
    })
    res.json(response)
  } catch (error: any) {
    const response = await error.json()
    res.status(500).json(response)
  }
}
