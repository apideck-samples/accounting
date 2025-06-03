import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { ConsumerMetadata, Session } from 'types/Session'

import { useToast } from '@apideck/components'
import camelCaseKeys from 'camelcase-keys-deep'
import { useCookieState } from 'hooks'
import { decode } from 'jsonwebtoken'
import { useRouter } from 'next/router'

type CreateSessionOptions = { consumerId: string; consumerMetadata: ConsumerMetadata }

interface ContextProps {
  createSession: (options: CreateSessionOptions) => Promise<void>
  setSession: Dispatch<SetStateAction<Session | null>>
  setToken: Dispatch<SetStateAction<string | null>>
  token: string | null
  clearSession: () => void
  session: Session | null
  isLoading: boolean
}

const SessionContext = createContext<Partial<ContextProps>>({})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { push } = useRouter()
  const { addToast } = useToast()
  const [session, setSession] = useState<Session | null>(null)
  const [token, setToken] = useCookieState('token', null, {
    encode: {
      samesite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 10 // 10 mins
    }
  })

  useEffect(() => {
    if (token) {
      const decoded: any = decode(token)
      const session = camelCaseKeys(decoded) as Session

      setSession({ ...session, jwt: token })
    }
  }, [token])

  console.log('session', session)

  const clearSession = () => {
    setSession(null)
    setToken(false)
  }

  const createSession = async ({ consumerId, consumerMetadata }: CreateSessionOptions) => {
    if (!consumerId) {
      addToast({
        title: 'Consumer ID is required',
        description:
          'Provide a unique ID. Most of the time, this is an ID of your internal data model that represents a user or account in your system.',
        type: 'warning',
        closeAfter: 7000
      })
      return
    }
    try {
      setIsLoading(true)
      const raw = await fetch(`/api/vault/sessions?consumerId=${consumerId}`, {
        method: 'POST',
        body: JSON.stringify({
          settings: { sandbox_mode: true },
          consumer_metadata: {
            email: consumerMetadata.email,
            user_name: consumerMetadata.userName,
            image: consumerMetadata.image
          }
        })
      })
      const response = await raw.json()

      if (!raw.ok) {
        addToast({
          title: response.message || 'Session creation failed',
          description:
            typeof response.error === 'string'
              ? response.error
              : response.error?.message || 'An unexpected error occurred on the server.',
          type: 'error'
        })
        return
      }

      const jwt = response.sessionToken

      if (jwt) {
        setToken(jwt)
        addToast({
          title: 'Session created',
          description: 'You can now use the sample application',
          type: 'success'
        })
        push('/')
      } else {
        addToast({
          title: 'Session token not found',
          description:
            'The session was created successfully, but the session token is missing in the response.',
          type: 'error'
        })
      }
    } catch (error: any) {
      addToast({
        title: 'Something went wrong during session creation',
        description: error?.message || 'A network or parsing error occurred.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SessionContext.Provider
      value={{ createSession, session, clearSession, setToken, token, isLoading }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  return useContext(SessionContext) as ContextProps
}
