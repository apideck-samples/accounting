import { Apideck } from '@apideck/unify'
import { VercelRequest, VercelResponse } from '@vercel/node'
// Potentially import Session type for stricter typing of parsedBody if needed:
// import { Session } from '@apideck/unify/models/components'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req
  const consumerIdFromQuery = query?.consumerId as string | undefined
  // Using a more robust random string and timestamp for uniqueness
  const consumerId =
    consumerIdFromQuery ||
    `demo-accounting-${Math.random().toString(36).substring(2, 10)}-${new Date().getTime()}`

  if (!process.env.API_KEY) {
    return res.status(500).json({ message: 'API_KEY environment variable is not set' })
  }
  if (!process.env.APP_ID) {
    return res.status(500).json({ message: 'APP_ID environment variable is not set' })
  }

  let sessionData: any
  try {
    if (!body) {
      // If body is not present, initialize sessionData as an empty object for default settings.
      // The Apideck API might allow this for session creation.
      sessionData = {}
    } else {
      sessionData = typeof body === 'string' ? JSON.parse(body) : body
    }
  } catch (e: unknown) {
    const parseErrorMessage = e instanceof Error ? e.message : 'Invalid JSON in request body'
    return res.status(400).json({ message: parseErrorMessage, error: e })
  }

  try {
    // Correctly initialize Apideck client once
    const apideck = new Apideck({
      apiKey: process.env.API_KEY as string,
      appId: process.env.APP_ID as string,
      // basePath: 'https://mock-api.apideck.com/', // Keep if needed for mocking
      consumerId: consumerId
    })

    // The request object for sessions.create expects the payload under a 'session' property
    const result = await apideck.vault.sessions.create({
      session: sessionData // sessionData is the parsed body or empty object
    })

    // Check if the creation was successful and the response structure is as expected
    if (result.createSessionResponse && result.createSessionResponse.data) {
      // Send only the nested data object containing session_token and session_uri
      res.json(result.createSessionResponse.data)
    } else {
      // Handle unexpected structure from Apideck SDK if necessary
      console.error('[API Vault Sessions Create] Unexpected SDK response structure:', result)
      res.status(500).json({ message: 'Unexpected response structure from session creation.' })
    }
  } catch (error: unknown) {
    console.error('[API Vault Sessions Create] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    const errorStatus = (error as any)?.statusCode || 500
    return res.status(errorStatus).json({ message: errorMessage, error: error })
  }
}
