import { ConsumerMetadata, Session } from 'types/Session'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import camelCaseKeys from 'camelcase-keys-deep'
import { decode } from 'jsonwebtoken'
import { useRouter } from 'next/router'
import { useStickyState } from './useStickyState'
import { useToast } from '@apideck/components'

type CreateSessionOptions = { consumerId: string; consumerMetadata: ConsumerMetadata }

interface ContextProps {
  createSession: (options: CreateSessionOptions) => Promise<void>
  setSession: Dispatch<SetStateAction<Session | null>>
  session: Session | null
  isLoading: boolean
}

const SessionContext = createContext<Partial<ContextProps>>({})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useStickyState(null, 'session')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { push } = useRouter()
  const { addToast } = useToast()

  // Creates a test session with a random consumerID
  const createSession = async ({ consumerId, consumerMetadata }: CreateSessionOptions) => {
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

      if (response.error) {
        addToast({
          title: response.message,
          description: response.detail.errors[0].message,
          type: 'error'
        })
        return
      }

      const jwt = response.data.session_token
      const decoded = decode(jwt)

      if (decoded) {
        const session = camelCaseKeys(decoded as any) as Session
        setSession({ ...session, jwt })
        addToast({
          title: 'Session created',
          description: 'You can now use the sample application',
          type: 'success'
        })
        push('/')
      }
    } catch (error: any) {
      addToast({
        title: 'Something went wrong',
        description: error?.message || error,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SessionContext.Provider value={{ createSession, session, setSession, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  return useContext(SessionContext) as ContextProps
}
