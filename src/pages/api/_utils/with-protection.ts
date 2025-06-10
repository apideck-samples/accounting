import { VercelRequest, VercelResponse } from '@vercel/node'

interface Options {
  requireServiceId?: boolean
  requireBody?: boolean
}

type ProtectedHandler = (
  req: VercelRequest,
  res: VercelResponse,
  context: { jwt: string; serviceId: string }
) => any

export function withProtection(handler: ProtectedHandler, options: Options = {}) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const { jwt, serviceId } = req.query

    if (!jwt) {
      return res.status(400).json({ message: 'JWT is required' })
    }

    if (options.requireServiceId && !serviceId) {
      return res.status(400).json({ message: 'Service ID is required' })
    }

    if (options.requireBody && !req.body) {
      return res.status(400).json({ message: 'Request body is required' })
    }

    const context = {
      jwt: jwt as string,
      serviceId: serviceId as string
    }

    return handler(req, res, context)
  }
}
