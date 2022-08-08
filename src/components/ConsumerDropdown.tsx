import { Dropdown } from '@apideck/components'
import { useSession } from 'utils'

const ConsumerDropdown = () => {
  const { session, clearSession } = useSession()

  return (
    <Dropdown
      upward
      options={[
        {
          label: 'Quit session',
          onClick: clearSession
        }
      ]}
      buttonLabel={'Loading...'}
      className="w-full"
      align="left"
      itemsClassName="w-full"
      buttonClassName="flex-shrink-0 w-full group block text-left"
      trigger={
        <div className="flex hover:bg-ui-600 rounded-md px-3 py-2">
          {session?.consumerMetadata?.image && (
            <div className="h-8 w-8 ring-ui-300 ring-2 rounded-full mr-3 overflow-hidden">
              <img src={session?.consumerMetadata?.image} className="object-cover h-full w-full" />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-xs font-medium text-ui-300 group-hover:text-white uppercase">
              {session?.consumerMetadata?.userName}
            </p>
            <p className="text-sm font-medium text-gray-50 group-hover:text-white">
              {session?.consumerMetadata?.email || session?.consumerMetadata?.accountName}
            </p>
          </div>
        </div>
      }
    />
  )
}

export default ConsumerDropdown
