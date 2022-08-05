import Layout from './Layout'
import { NextPage } from 'next'
import type { ReactNode } from 'react'
import Spinner from './Spinner'

interface Props {
  children?: ReactNode
}

const PageLoader: NextPage = ({ children }: Props) => {
  return (
    <Layout>
      {children ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4 text-center">
          <Spinner />
        </div>
      )}
    </Layout>
  )
}

export default PageLoader
