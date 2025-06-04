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

  try {
    const apideck = init(jwt as string)
    const expense = JSON.parse(body)

    // Convert transactionDate string to Date object if present
    if (expense.transactionDate && typeof expense.transactionDate === 'string') {
      expense.transactionDate = new Date(expense.transactionDate)
    }

    const response = await apideck.accounting.expenses.create({
      serviceId,
      expense
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to add expense')
  }
}
