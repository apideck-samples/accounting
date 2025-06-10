import { Dialog, Transition } from '@headlessui/react'
import { useConnections, useSession } from 'hooks'
import { Fragment, ReactNode, useState } from 'react'
import {
  HiMenu,
  HiOutlineBookOpen,
  HiOutlineCash,
  HiOutlineDocumentSearch,
  HiOutlineExternalLink,
  HiOutlinePresentationChartBar,
  HiOutlineUserGroup,
  HiX
} from 'react-icons/hi'

import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiBarChart2 } from 'react-icons/fi'
import { IoTelescopeOutline } from 'react-icons/io5'
import ConsumerDropdown from './ConsumerDropdown'
import SelectConnection from './SelectConnection'

interface Props {
  children: ReactNode
}

const SidebarLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useRouter()
  const { session } = useSession()
  const { connection } = useConnections()

  const searchQuery = new URLSearchParams({
    headers: JSON.stringify({
      Authorization: `Bearer ${session?.jwt}`,
      'x-apideck-auth-type': 'JWT',
      'x-apideck-app-id': session?.applicationId,
      'x-apideck-consumer-id': session?.consumerId,
      'x-apideck-service-id': connection?.serviceId
    }),
    id: 'accounting'
  })

  const items = [
    {
      name: 'Profit & Loss',
      href: '/profit-and-loss',
      icon: FiBarChart2
    },
    {
      name: 'Balance Sheet',
      href: `/balance-sheet`,
      icon: HiOutlinePresentationChartBar
    },
    {
      name: 'Invoices',
      href: `/`,
      icon: HiOutlineDocumentSearch
    },
    {
      name: 'Customers',
      href: `/customers`,
      icon: HiOutlineUserGroup
    },
    {
      name: 'Payments',
      href: `/payments`,
      icon: HiOutlineCash
    },
    {
      name: 'Expenses',
      href: `/expenses`,
      icon: HiOutlineCash
    },
    {
      name: 'Suppliers',
      href: `/suppliers`,
      icon: HiOutlineUserGroup
    },
    {
      name: 'Documentation',
      href: 'https://developers.apideck.com/apis/accounting/reference',
      icon: HiOutlineBookOpen,
      external: true
    },
    {
      name: 'API Explorer',
      icon: IoTelescopeOutline,
      current: false,
      external: true,
      href: `https://developers.apideck.com/api-explorer?${searchQuery}`
    }
  ]

  return (
    <>
      <div data-testid="sidebar">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-30 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-ui-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <HiX className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto custom-scrollbar-dark">
                  <div className="flex items-center flex-shrink-0 px-4">
                    <img className="h-6 w-auto" src="/img/logo-white.svg" alt="Apideck" />
                  </div>
                  <div className="flex-shrink-0 flex border-b border-ui-600 px-3 py-4">
                    <SelectConnection />
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {items.map((item) => {
                      return (
                        <Link key={item.name} href={item.href}>
                          <a
                            target={item.external ? '_blank' : '_self'}
                            className={classNames(
                              pathname === item.href
                                ? 'bg-ui-600 text-white'
                                : 'text-white hover:bg-ui-600 hover:bg-opacity-75',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}
                          >
                            {item.name}
                          </a>
                        </Link>
                      )
                    })}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-ui-600 p-4">
                  <ConsumerDropdown />
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-ui-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto custom-scrollbar-dark">
              <div className="flex items-center flex-shrink-0 px-4">
                <img className="h-6 w-auto" src="/img/logo-white.svg" alt="Apideck" />
              </div>
              <span className="text-xs text-white px-4 pt-1">Accounting Sample</span>
              <div className="flex-shrink-0 flex border-b border-ui-600 px-3 py-4">
                <SelectConnection />
              </div>
              <nav className="mt-5 flex-1 px-3 space-y-1">
                {items.map((item) => {
                  return (
                    <Link key={item.name} href={item.href}>
                      <a
                        target={item.external ? '_blank' : '_self'}
                        className={classNames(
                          pathname === item.href
                            ? 'bg-ui-600 text-white border-primary-500'
                            : 'text-white hover:bg-ui-500 border-transparent',
                          'group flex items-center justify-between px-3 py-2.5 text-sm rounded border-l-4 group'
                        )}
                      >
                        <span className="flex items-center">
                          {item.icon && (
                            <item.icon
                              className={classNames(
                                pathname === item.href
                                  ? 'text-white'
                                  : 'text-ui-300 group-hover:text-ui-200',
                                'mr-3 flex-shrink-0 h-5 w-5'
                              )}
                              aria-hidden="true"
                            />
                          )}
                          {item.name}
                        </span>
                        {item.external && (
                          <HiOutlineExternalLink className="text-ui-200 h-4 w-4 opacity-0 group-hover:opacity-100" />
                        )}
                      </a>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-ui-600 p-2 min-h-[69px]">
              {/* <AccountDropdown /> */}

              <ConsumerDropdown />
            </div>
          </div>
        </div>

        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-200 border-b border-gray-300">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ui-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <HiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  )
}

export default SidebarLayout
