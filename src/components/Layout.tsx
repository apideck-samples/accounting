import Head from 'next/head'
import { ReactNode } from 'react'
import SidebarLayout from './SidebarLayout'

type Props = {
  children: ReactNode
  title?: string
  description?: string
  favicon?: string
}

const Layout = ({
  children,
  title = 'Apideck - Account Sample',
  description = 'A sample project demonstrating the use of the Apideck Accounting API',
  favicon = '/img/logo.png'
}: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href={favicon} />
    </Head>
    <div className="min-h-screen h-full bg-gray-50 font-basier-circle">
      <SidebarLayout>
        <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </SidebarLayout>
    </div>
  </>
)

export default Layout
