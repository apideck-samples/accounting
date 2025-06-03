import type { VercelRequest, VercelResponse } from '@vercel/node'
import { init } from '../_utils'

import { BalanceSheetFilter } from '@apideck/unify/models/components'

interface Params {
  serviceId?: string
  jwt?: string
  filter?: BalanceSheetFilter
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jwt, serviceId }: Params = req.query
  const queryEndDate = req.query['filter[end_date]'] as string | undefined
  // Add other filter param parsers here, e.g.:
  // const queryStartDate = req.query['filter[start_date]'] as string | undefined;
  // const queryPeriodCount = req.query['filter[period_count]'] as string | undefined;
  // const queryPeriodType = req.query['filter[period_type]'] as string | undefined;

  if (!jwt) {
    return res.status(400).json({ message: 'JWT is required' })
  }
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' })
  }

  const filter: { endDate?: string } = {}
  if (queryEndDate) {
    filter.endDate = queryEndDate
  }
  // if (queryStartDate) { // startDate is deprecated but example of use
  //   filter.startDate = queryStartDate;
  // }
  // if (queryPeriodCount) {
  //  filter.periodCount = parseInt(queryPeriodCount, 10); // Ensure it's a number
  // }
  // if (queryPeriodType) {
  //  filter.periodType = queryPeriodType; // Ensure it matches PeriodType enum values
  // }

  try {
    const apideck = init(jwt as string)
    const response = await apideck.accounting.balanceSheet.get({
      serviceId: serviceId,
      filter: Object.keys(filter).length > 0 ? filter : undefined
    })
    res.json(response)
  } catch (error: unknown) {
    console.error('[API Balance Sheet] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
