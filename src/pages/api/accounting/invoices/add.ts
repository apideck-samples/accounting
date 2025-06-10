import { Invoice, InvoiceType } from '@apideck/unify/models/components'
import { RFCDate } from '@apideck/unify/types'
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
