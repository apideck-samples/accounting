import { ComponentType, useEffect, useState } from 'react'

import Layout from 'components/Layout'
import PageHeading from 'components/PageHeading'
import PageLoader from 'components/PageLoader'
import { useRouter } from 'next/router'
import { useSession } from './useSession'

const defaultOnLoading = (): JSX.Element => <PageLoader />
const defaultOnError = (error: any): JSX.Element => (
  <Layout>
    <PageHeading
      title="Something when wrong"
      description={`An error occurred: "${error.message}".`}
    />
  </Layout>
)
const defaultOnRedirecting = (): JSX.Element => <Layout>Invalid session...</Layout>

/**
 * Options for the withPageSessionRequired Higher Order Component
 */
export interface WithPageSessionRequiredOptions {
  /**
   * Add a path to return the user to after login
   */
  returnTo?: string
  /**
   * Render a message to show that the user is being redirected to the login page
   */
  onRedirecting?: () => JSX.Element
  /**
   * Render a fallback in case of error fetching the user from the API
   */
  onError?: (error: Error) => JSX.Element
  /**
   * Render custom loading screen during the fetching of the current user
   */
  onLoading?: () => JSX.Element
}

export interface WithPageSessionRequiredProps {
  [key: string]: any
}

export type WithPageSessionRequired = <P extends WithPageSessionRequiredProps>(
  Component: ComponentType<P>,
  options?: WithPageSessionRequiredOptions
) => React.FC<P>

/**
 * ```js
 * const MyProtectedPage = withSession(MyPage);
 * ```
 *
 * When a page component is wrapped in this Higher Order Component and an anonymous user visits the page
 * they will be redirected to the invalid session page and then returned to the page they were redirected from (after creating session).
 * If the session is successfully fetched it will be passed to the page component as a prop.
 *
 */
export const withSession: WithPageSessionRequired = (Component, options = {}) => {
  return function WithPageSessionRequired(props): JSX.Element {
    const [mounted, setMounted] = useState(false)

    const {
      returnTo = '/invalid-session',
      onRedirecting = defaultOnRedirecting,
      onError = defaultOnError,
      onLoading = defaultOnLoading
    } = options
    const { push } = useRouter()

    const { token, isLoading } = useSession()

    useEffect(() => setMounted(true), [])

    useEffect(() => {
      if (token || isLoading) return

      push(returnTo)
    }, [isLoading, push, returnTo, token])

    if (!mounted) return <Component {...props} />
    if (isLoading) return onLoading()

    const error = false
    if (error) return onError(error)

    if (token) {
      return <Component {...props} />
    }

    return onRedirecting()
  }
}

export default withSession
