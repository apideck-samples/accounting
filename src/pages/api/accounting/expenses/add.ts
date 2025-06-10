import { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../../_utils'
import { handleApiError } from '../../_utils/apiErrorUtils'
import { withProtection } from '../../_utils/with-protection'

async function handler(
  req: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) {
  const { jwt, serviceId } = context
  const { body } = req

  try {
    const apideck = init(jwt)
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

export default withProtection(handler, { requireServiceId: true, requireBody: true })
