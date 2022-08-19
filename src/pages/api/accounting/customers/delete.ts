import { VercelRequest, VercelResponse } from '@vercel/node'

import { init } from '../../_utils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = JSON.parse(req.body)
  const { jwt, serviceId }: Params = req.query
  const apideck = init(jwt as string)

  const result = await apideck.accounting
    .customersDelete({ serviceId, id })
    .catch(async (error: Response) => await error.json())
  res.json(result)
}
