import { Dispatch, ReactNode, createContext, useContext, useEffect } from 'react'

import { Connection } from '@apideck/node'
import { useCookieState } from './useCookieState'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useSession } from 'hooks'

interface ContextProps {
  setConnectionId: Dispatch<string>
  connectionId?: string | null
  connections: Connection[]
  connection: Connection | null
  isLoading: boolean
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
    return await response.json()
  }

  const { data, error } = useSWR(
    session?.jwt ? `/api/vault/connections?jwt=${session?.jwt}` : null,
    getConnections
  )

  const isLoading = !!(session?.jwt && !data && !error)
  const connections = data?.data
  const connection = connections?.find((c: Connection) => c.id === connectionId)
  const callableConnections = connections?.filter(
    (connection: Connection) => connection.state === 'callable'
  )

  useEffect(() => {
    if (!connectionId && callableConnections?.length) {
      setConnectionId(callableConnections[0].id)
    }
  }, [setConnectionId, callableConnections, connectionId])

  if (!data?.data && error && pathname !== '/invalid-session') push('/invalid-session')

  return (
    <ConnectorContext.Provider value={{ setConnectionId, connection, isLoading, connections }}>
      {children}
    </ConnectorContext.Provider>
  )
}

export const useConnections = () => {
  return useContext(ConnectorContext) as ContextProps
}
