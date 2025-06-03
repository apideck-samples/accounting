import { CustomerInput } from '@apideck/unify/models/components'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req
  const { jwt, serviceId }: Params = query

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }
  if (!body) {
    return res.status(400).json({ message: 'Request body is required' })
  }

  let customerData: CustomerInput
  try {
    customerData = typeof body === 'string' ? JSON.parse(body) : body
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  try {
    const apideck = init(jwt as string)
    const response = await apideck.accounting.customers.create({
      serviceId: serviceId,
      customer: customerData
    })
    res.json(response.createCustomerResponse?.data)
  } catch (error: unknown) {
    console.error('[API Customers Add] Error:', error)
    console.error('Details:', (error as any)?.detail.error.Elements[0]?.ValidationErrors)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
