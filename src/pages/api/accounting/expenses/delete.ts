import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'

interface Params {
  jwt?: string
  serviceId?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = JSON.parse(req.body)
  const { jwt, serviceId }: Params = req.query

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }
  if (!id) {
    return res.status(400).json({ message: 'Expense ID is required' })
  }

  try {
    const apideck = init(jwt as string)
    const result = await apideck.accounting.expenses.delete({ serviceId, id })
    res.json(result)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to delete expense')
  }
}
