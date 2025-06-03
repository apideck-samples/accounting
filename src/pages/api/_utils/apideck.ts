import { Apideck } from '@apideck/unify'
import camelCaseKeys from 'camelcase-keys-deep'
import { decode } from 'jsonwebtoken'

export const init = (jwt: string) => {
  if (!jwt) {
    throw new Error('JWT is required')
  }
  const decoded: unknown = decode(jwt)

  if (!decoded || typeof decoded !== 'object' || decoded === null) {
    throw new Error('Invalid JWT token: Failed to decode or not an object.')
  }

  const decodedObject = decoded as Record<string, any>

  const { applicationId, consumerId } = camelCaseKeys(decodedObject) as {
    applicationId?: string
    consumerId?: string
  }

  if (!applicationId) {
    throw new Error('Missing applicationId in JWT token')
  }
  if (!consumerId) {
    throw new Error('Missing consumerId in JWT token')
  }
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set')
  }

  return new Apideck({
    apiKey: process.env.API_KEY,
    appId: applicationId,
    consumerId
    // basePath: 'https://mock-api.apideck.com/'
  })
}
