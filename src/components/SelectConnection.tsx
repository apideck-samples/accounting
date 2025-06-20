import { Menu, Transition } from '@headlessui/react'
import { useConnections, useSession } from 'hooks'

import { Connection } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import { useEffect, useState } from 'react'
import Spinner from './Spinner'

const SelectConnection = () => {
  const { setConnectionId, connection, connections, isLoading, mutate } = useConnections()
  const { token } = useSession()
  const [serviceId, setServiceId] = useState<string | null>(null)

  useEffect(() => {
    if (token && serviceId) {
      ApideckVault.open({
        token: token,
        showAttribution: true,
        serviceId: serviceId,
        unifiedApi: 'accounting',
        onClose: () => {
          setServiceId(null)
          mutate()
        }
      })
    }
  }, [token, serviceId, mutate])

  const selectConnection = async (connection: Connection) => {
    if (connection.state === 'callable') {
      setConnectionId(connection.id as string)
    } else {
      setServiceId(connection.serviceId as string)
    }
  }

  const statusColor = (connection: Connection) => {
    if (!connection.enabled) return 'bg-gray-300'
    if (connection.state !== 'callable') return 'bg-yellow-400'
    return 'bg-green-400'
  }

  return (
    <div className="relative w-full">
      <Menu>
        {({ open }: { open: boolean }) => (
          <>
            <Menu.Button className="bg-ui-600 text-white w-full flex items-center justify-between px-4 py-2 text-sm font-medium border rounded-md shadow-sm border-ui-500 group hover:bg-ui-500 focus:outline-none">
              <div className="flex items-center">
                {!isLoading && connection?.icon && (
                  <div className="w-6 h-6 -ml-0.5 mr-2.5">
                    <img
                      className={`rounded-full ring-2 ring-ui-400 ${
                        isLoading ? 'animate-spin opacity-20' : ''
                      }`}
                      src={!isLoading && connection?.icon ? connection?.icon : '/img/logo.png'}
                      alt={connection.name || 'Service Icon'}
                      height={28}
                      width={28}
                    />
                  </div>
                )}
                {isLoading && <Spinner className="w-6 h-6" />}
                {!isLoading && <span>{connection?.name || 'Select integration'}</span>}
              </div>
              <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Menu.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              className="min-w-sm"
            >
              <Menu.Items
                static
                className="absolute custom-scrollbar-dark right-0 z-10 w-full mt-2 origin-top-right backdrop-blur-md bg-ui-500/40 border divide-y rounded-md outline-none border-ui-500 divide-ui-500"
              >
                <div className="py-1">
                  {connections?.map((connectionItem: Connection, i: number) => {
                    return (
                      <Menu.Item key={i}>
                        {({ active }: { active: boolean }) => (
                          <div
                            onClick={() => selectConnection(connectionItem)}
                            className={`${
                              active ? 'backdrop-blur-lg bg-ui-500/50 transition' : 'bg-none'
                            } flex items-center justify-between min-w-0 px-2 cursor-pointer py-0.5 overflow-hidden ${
                              connectionItem.enabled ? '' : 'opacity-60'
                            }`}
                          >
                            <div className="flex p-2">
                              <img
                                className="rounded-full ring-ui-400 ring-2"
                                src={connectionItem.icon}
                                alt={connectionItem.name || 'Service Icon'}
                                height={28}
                                width={28}
                              />
                            </div>
                            <span className="flex-1 min-w-0 text-sm ml-1 text-white truncate pr-1">
                              {connectionItem.name}
                            </span>

                            <span
                              className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${statusColor(
                                connectionItem
                              )}`}
                            ></span>
                          </div>
                        )}
                      </Menu.Item>
                    )
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

export default SelectConnection
