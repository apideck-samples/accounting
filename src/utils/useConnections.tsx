import { Dispatch, ReactNode, createContext, useContext } from 'react'

import { Connection } from '@apideck/node'
import { useCookieState } from './useCookieState'
import useSWR from 'swr'
import { useSession } from './useSession'

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

  const connection = data?.data?.find((c: Connection) => c.id === connectionId)

  return (
    <ConnectorContext.Provider
      value={{ setConnectionId, connection, isLoading, connections: data?.data }}
    >
      {children}
    </ConnectorContext.Provider>
  )
}

export const useConnections = () => {
  return useContext(ConnectorContext) as ContextProps
}
