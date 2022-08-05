import { VercelRequest, VercelResponse } from '@vercel/node'

import { GetInvoicesResponse } from '@apideck/node'
import { init } from '../../_utils'

interface Params {
  serviceId?: string
  cursor?: string
  jwt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId, cursor }: Params = req.query
  const apideck = init(jwt)

  const result: Promise<GetInvoicesResponse> = await apideck.accounting
    .invoicesAll({ limit: 20, serviceId, cursor })
    .catch(async (error: Response) => await error.json())

  res.json(result)
}
