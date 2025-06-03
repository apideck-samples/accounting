import { Connection } from '@apideck/unify/models/components'
import { ApideckVault } from '@apideck/vault-js'
import classNames from 'classnames'
import { useConnections, useSession } from 'hooks'
import { useEffect, useState } from 'react'
import { FaCheckCircle, FaCircle, FaCog, FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { HiCloud } from 'react-icons/hi'
import Spinner from './Spinner'

const SelectConnectionGrid = () => {
  const { setConnectionId, connection, connections, isLoading, mutate } = useConnections()
  const { token } = useSession()
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])

  // Filter connections based on search term
  useEffect(() => {
    if (!connections) return

    const filtered = connections.filter(
      (conn) =>
        conn.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.serviceId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredConnections(filtered)
  }, [connections, searchTerm])

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

  const getStatusConfig = (connection: Connection) => {
    const { state, enabled } = connection

    if (!enabled) {
      return {
        icon: FaCircle,
        iconSize: 8,
        label: 'Disabled',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-600 dark:text-gray-400',
        dotColor: 'bg-gray-400',
        badgeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
      }
    }

    if (state === 'callable') {
      return {
        icon: FaCheckCircle,
        iconSize: 10,
        label: 'Connected',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        dotColor: 'bg-emerald-500',
        badgeColor: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      }
    }

    if (state === 'invalid') {
      return {
        icon: FaExclamationTriangle,
        iconSize: 10,
        label: 'Invalid',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-400',
        dotColor: 'bg-red-500',
        badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      }
    }

    return {
      icon: FaCog,
      iconSize: 10,
      label: 'Setup',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-400',
      dotColor: 'bg-amber-500',
      badgeColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center">
              <Spinner className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Loading integrations...
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fetching your available accounting connections
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!connections?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
          <HiCloud className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          No integrations available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-6">
          Configure your accounting integrations in your workspace settings to start connecting with
          your business systems.
        </p>
        <button className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors">
          Configure Integrations
        </button>
      </div>
    )
  }

  const connectedCount = connections.filter((c) => c.state === 'callable' && c.enabled).length
  const totalCount = connections.length

  return (
    <div className="p-8">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Integration</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {connectedCount} of {totalCount} integrations connected
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredConnections.map((connectionItem: Connection, index: number) => {
          const statusConfig = getStatusConfig(connectionItem)
          const StatusIcon = statusConfig.icon
          const isSelected = connection?.id === connectionItem.id
          const isCallable = connectionItem.state === 'callable'
          const isEnabled = connectionItem.enabled

          return (
            <div
              key={connectionItem.id || index}
              onClick={() => selectConnection(connectionItem)}
              className={classNames(
                'group relative flex flex-col p-6 transition-all duration-200 ease-in-out cursor-pointer rounded-2xl border',
                'hover:shadow-lg hover:scale-[1.02]',
                {
                  'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 shadow-md ring-1 ring-cyan-500/20':
                    isSelected,
                  'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600':
                    !isSelected,
                  'opacity-75': !isEnabled
                }
              )}
            >
              {/* Top Section: Icon + Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div
                    className={classNames(
                      'w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600',
                      'group-hover:scale-105 transition-transform duration-200'
                    )}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={connectionItem.icon}
                      alt={connectionItem.name || 'Service Icon'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <HiCloud className="w-full h-full p-3 text-gray-400 hidden" />
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={classNames(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    statusConfig.badgeColor
                  )}
                >
                  <StatusIcon className="mr-1" size={statusConfig.iconSize} />
                  {statusConfig.label}
                </div>
              </div>

              {/* Connection Info */}
              <div className="flex-1">
                <h3
                  className={classNames(
                    'text-base font-semibold mb-2 transition-colors duration-200',
                    'text-gray-900 dark:text-white',
                    {
                      'text-cyan-700 dark:text-cyan-300': isSelected,
                      'group-hover:text-cyan-600 dark:group-hover:text-cyan-400': !isSelected
                    }
                  )}
                >
                  {connectionItem.name}
                </h3>

                {/* Service ID */}
                {connectionItem.tagLine && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-3">
                    {connectionItem.tagLine}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div
                className={classNames(
                  'mt-4 text-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                  {
                    'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300': isCallable,
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300':
                      !isCallable && isEnabled,
                    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400': !isEnabled
                  }
                )}
              >
                {!isEnabled ? 'Disabled' : isCallable ? 'Select' : 'Configure'}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {searchTerm && filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No integrations found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search term or browse all available integrations.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

export default SelectConnectionGrid
