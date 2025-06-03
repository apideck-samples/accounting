import { useConnections } from 'hooks'
import { ReactNode } from 'react'
import Layout from './Layout'
import PageHeading from './PageHeading'
import SelectConnectionGrid from './SelectConnectionGrid'

type Props = {
  children: ReactNode
  title: string
  description?: string
  favicon?: string
}

const ConnectionRequiredLayout = ({ children, title, description, favicon }: Props) => {
  const { connection, connections } = useConnections()

  const hasActiveConnection = connection?.enabled && connection?.state === 'callable'

  const pageTitle = hasActiveConnection ? title : 'Connection required'
  const pageDescription = hasActiveConnection
    ? description
    : 'Select an integration to get started.'

  return (
    <Layout title={pageTitle} description={pageDescription} favicon={favicon}>
      {hasActiveConnection ? (
        children
      ) : (
        <div className="space-y-8">
          <PageHeading
            title={pageTitle}
            description={
              !connections?.length
                ? 'No integrations configured. Please set up your accounting integrations to continue.'
                : !connection
                ? 'Select an integration to access your accounting data and perform operations.'
                : connection.state !== 'callable'
                ? `Complete the setup for ${connection.name} to continue.`
                : 'Please enable your integration to continue.'
            }
          />

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <SelectConnectionGrid />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default ConnectionRequiredLayout
