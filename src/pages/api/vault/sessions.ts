import Apideck, { CreateSessionResponse } from '@apideck/node'
import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req
  const consumerId =
    (query?.consumerId as string) || `demo-accounting-${Math.random()}-${new Date().toISOString()}`

  // basePath: 'https://mock-api.apideck.com/',
  const apideck = new Apideck({
    apiKey: `${process.env.API_KEY}`,
    appId: `${process.env.APP_ID}`,
    consumerId
  })

  const result: Promise<CreateSessionResponse> = await apideck.vault
    .sessionsCreate({ session: JSON.parse(body) })
    .catch(async (error: Response) => await error.json())

  res.json(result)
}
