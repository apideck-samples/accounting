import { Supplier } from '@apideck/unify/models/components' // Import Supplier type for the body
import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

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

  try {
    const apideck = init(jwt as string)
    const supplierData = (typeof body === 'string' ? JSON.parse(body) : body) as Omit<
      Supplier,
      'id'
    >

    const response = await apideck.accounting.suppliers.create({
      serviceId,
      supplier: supplierData
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to create supplier')
  }
}
