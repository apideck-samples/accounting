import { VercelRequest, VercelResponse } from '@vercel/node'

import { init } from '../../_utils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, invoice } = JSON.parse(req.body)
  const { jwt, serviceId }: Params = req.query
  const apideck = init(jwt as string)

  const result = await apideck.accounting
    .invoicesUpdate({ serviceId, id, invoice })
    .catch(async (error: Response) => await error.json())

  res.json(result)
}
