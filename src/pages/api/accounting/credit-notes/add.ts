import { CreditNoteInput } from '@apideck/unify/models/components'
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

export default withProtection(handler, { requireServiceId: true, requireBody: true })
