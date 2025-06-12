interface ChatHeaderProps {
  connection: any
}

export function ChatHeader({ connection }: ChatHeaderProps) {
  return (
    <div className="p-5 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">AI Assistant</h3>
          <p className="text-primary-100 text-sm">
            {connection ? `Connected to ${connection.name}` : 'Not connected'}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <img
            src={connection?.icon || connection?.logo}
            alt="Apideck Logo"
            className="w-10 h-10"
          />
        </div>
      </div>
    </div>
  )
}
