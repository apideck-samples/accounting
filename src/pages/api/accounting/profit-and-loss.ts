import type { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../_utils'
import { withProtection } from '../_utils/with-protection'

async function handler(
  req: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) {
  const { jwt, serviceId } = context
  const queryStartDate = req.query['filter[start_date]'] as string | undefined
  const queryEndDate = req.query['filter[end_date]'] as string | undefined

  const filter: { startDate?: string; endDate?: string; customerId?: string } = {}
  if (queryStartDate) {
    filter.startDate = queryStartDate
  }
  if (queryEndDate) {
    filter.endDate = queryEndDate
  }
  // Example if customerId was also a filter option from query:
  // const queryCustomerId = req.query['filter[customer_id]'] as string | undefined;
  // if (queryCustomerId) {
  //   filter.customerId = queryCustomerId;
  // }

  try {
    const apideck = init(jwt)
    const response = await apideck.accounting.profitAndLoss.get({
      serviceId: serviceId,
      filter: Object.keys(filter).length > 0 ? filter : undefined
    })
    res.json(response)
  } catch (error: unknown) {
    console.error('[API Profit and Loss] Error:', error)

    // Handle SDK validation errors specifically
    if ((error as any)?.name === 'SDKValidationError') {
      console.error(
        '[API Profit and Loss] Schema validation failed - this may be a connector-specific issue'
      )

      // Extract the actual validation issues for better debugging
      const validationIssues = (error as any)?.cause?.issues || []
      const errorDetails = validationIssues
        .map((issue: any) => `${issue.path?.join('.')} - ${issue.message}`)
        .join('; ')

      return res.status(400).json({
        message: `Schema validation failed: ${
          errorDetails || (error as any)?.message || 'Unknown validation error'
        }`,
        error: error,
        validationIssues: validationIssues
      })
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
export default withProtection(handler, { requireServiceId: true })
