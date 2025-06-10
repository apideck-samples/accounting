import { Invoice, InvoiceType } from '@apideck/unify/models/components'
import { RFCDate } from '@apideck/unify/types'
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
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body

    const invoiceForSDK: Omit<Invoice, 'id'> = {
      ...parsedBody,
      invoiceDate: parsedBody.invoiceDate
        ? new RFCDate(parsedBody.invoiceDate as string)
        : undefined,
      dueDate: parsedBody.dueDate ? new RFCDate(parsedBody.dueDate as string) : undefined,
      type: Object.values(InvoiceType).includes(parsedBody.type as InvoiceType)
        ? (parsedBody.type as InvoiceType)
        : InvoiceType.Standard
    }

    const response = await apideck.accounting.invoices.create({
      serviceId,
      invoice: invoiceForSDK
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to create invoice')
  }
}

export default withProtection(handler, { requireServiceId: true, requireBody: true })
