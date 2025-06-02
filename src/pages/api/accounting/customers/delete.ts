import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'

interface Params {
  jwt?: string
  serviceId?: string
}

interface Body {
  id?: string
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

  let parsedBody: Body
  try {
    parsedBody = typeof body === 'string' ? JSON.parse(body) : body
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  const { id } = parsedBody

  if (!id) {
    return res.status(400).json({ message: 'Customer ID (id) is required in the body' })
  }

  try {
    const apideck = init(jwt as string)
    const result = await apideck.accounting.customers.delete({
      serviceId: serviceId,
      id: id
    })
    if (result && (result as any).statusCode === 204) {
      return res.status(204).end()
    }
    res.json(result)
  } catch (error: unknown) {
    console.error('[API Customers Delete] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
