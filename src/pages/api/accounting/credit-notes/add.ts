import { CreditNoteInput } from '@apideck/unify/models/components'
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
    const creditNoteData = (typeof body === 'string' ? JSON.parse(body) : body) as CreditNoteInput

    const response = await apideck.accounting.creditNotes.create({
      serviceId,
      creditNote: creditNoteData
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to create credit note')
  }
}
