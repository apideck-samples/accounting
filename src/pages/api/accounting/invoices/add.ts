import { VercelRequest, VercelResponse } from '@vercel/node'

import { init } from '../../_utils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req
  const { jwt, serviceId }: Params = query
  const apideck = init(jwt)
  const invoice = JSON.parse(body)

  const result = await apideck.accounting
    .invoicesAdd({ serviceId, invoice })
    .catch(async (error: Response) => await error.json())

  res.json(result)
}
