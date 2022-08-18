import { VercelRequest, VercelResponse } from '@vercel/node'

import { CreateCustomerResponse } from '@apideck/node'
import { init } from '../../_utils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req
  const { jwt, serviceId }: Params = query
  const apideck = init(jwt as any)
  const customer = JSON.parse(body)



  try {
    const response: CreateCustomerResponse = await await apideck.accounting.customersAdd({
      serviceId,
      customer
    })
    res.json(response)
  } catch (error: any) {
    const response = await error.json()
    res.status(500).json(response)
  }
}
