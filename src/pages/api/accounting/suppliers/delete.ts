import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const { jwt, serviceId }: Params = req.query

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }
  if (!id) {
    return res.status(400).json({ message: 'Supplier ID is required in the request body' })
  }

  try {
    const apideck = init(jwt as string)
    const result = await apideck.accounting.suppliers.delete({ serviceId, id })
    // A successful DELETE usually returns a 200 OK with the GetSupplierResponse or similar,
    // or a 204 No Content if the resource is deleted and nothing is returned.
    // The Apideck SDK handles this and the result object would reflect it.
    res.status(200).json(result)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to delete supplier')
  }
}
