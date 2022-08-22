import PageLoader from 'components/PageLoader'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'hooks'

// Route to apply session from JWT in URL
// Used when creating a demo session on apideck.com and redirecting to the hosted demo app
const SessionPage = () => {
  const { push, query } = useRouter()
  const { setToken } = useSession()

  useEffect(() => {
    if (query.jwt) {
      setToken(query.jwt as string)
      push('/')
    }
  }, [push, query.jwt, setToken])

  return <PageLoader />
}

export default SessionPage
