import { Supplier } from '@apideck/unify/models/components' // Import Supplier type for the body
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
    const supplierData = (typeof body === 'string' ? JSON.parse(body) : body) as Omit<
      Supplier,
      'id'
    >

    const response = await apideck.accounting.suppliers.create({
      serviceId,
      supplier: supplierData
    })
    res.json(response)
  } catch (error: unknown) {
    handleApiError(res, error, 'Failed to create supplier')
  }
}

export default withProtection(handler, { requireServiceId: true, requireBody: true })
