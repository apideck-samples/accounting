import { VercelRequest, VercelResponse } from '@vercel/node'

import { GetPaymentsResponse } from '@apideck/node'
import { init } from '../../_utils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId, cursor }: Params = req.query
  const apideck = init(jwt as string)

  try {
    const response: GetPaymentsResponse = await apideck.accounting.paymentsAll({
      limit: 20,
      serviceId,
      cursor
    })
    res.json(response)
  } catch (error: any) {
    const response = await error.json()
    res.status(500).json(response)
  }
}
