import { Dispatch, ReactNode, createContext, useContext, useEffect } from 'react'

import { Connection } from '@apideck/unify/models/components'
import { useSession } from 'hooks'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useCookieState } from './useCookieState'

interface ContextProps {
  setConnectionId: Dispatch<string>
  connectionId?: string | null
  connections: Connection[] | undefined
  connection: Connection | null | undefined
  isLoading: boolean
  mutate: any
}

const ConnectorContext = createContext<Partial<ContextProps>>({})

export const ConnectionsProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession()
  const { push, pathname } = useRouter()
  const [connectionId, setConnectionId] = useCookieState('connectionId', null, {
    encode: {
      maxAge: 60 * 10 // 10 mins
    }
  })

  const getConnections = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }
    return await response.json()
  }

  const { data, error, mutate } = useSWR(
    session?.jwt ? `/api/vault/connections?jwt=${session?.jwt}` : null,
    getConnections
  )

  const isLoading = !!(session?.jwt && !data && !error)
  const connections = data?.getConnectionsResponse?.data as Connection[] | undefined
  const connection = connections?.find((c: Connection) => c.id === connectionId)
  const callableConnections = connections?.filter((c: Connection) => c.state === 'callable')

  useEffect(() => {
    if (!connectionId && callableConnections?.length) {
      setConnectionId(callableConnections[0].id as string)
    } else if (
      connectionId &&
      !callableConnections?.find((c: Connection) => c.id === connectionId)
    ) {
      setConnectionId(null)
    }
  }, [setConnectionId, callableConnections, connectionId])

  console.log('error', error)
  console.log('data', data)
  console.log('session', session)

  if (error && !connections && pathname !== '/invalid-session') {
    console.error('Redirecting to /invalid-session due to SWR error:', error)
    push('/invalid-session')
  }

  return (
    <ConnectorContext.Provider
      value={{ setConnectionId, connection, isLoading, connections, mutate }}
    >
      {children}
    </ConnectorContext.Provider>
  )
}

export const useConnections = () => {
  return useContext(ConnectorContext) as ContextProps
}
