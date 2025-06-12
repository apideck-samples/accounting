import { UseChatHelpers } from '@ai-sdk/react'

type ChatInputFormProps = Pick<
  UseChatHelpers,
  'input' | 'handleInputChange' | 'handleSubmit' | 'status'
> & {
  connectionName: string | undefined
}

export function ChatInputForm({
  input,
  handleInputChange,
  handleSubmit,
  status,
  connectionName
}: ChatInputFormProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            disabled={status !== 'ready'}
            placeholder="Ask about customers, invoices, expenses..."
            className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {status === 'streaming'
              ? 'AI is responding...'
              : status === 'ready'
              ? 'Ready to help'
              : 'Connecting...'}
          </span>
          <span className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                status === 'ready'
                  ? 'bg-green-400'
                  : status === 'streaming'
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-gray-400'
              }`}
            ></div>
            {connectionName || 'Not connected'}
          </span>
        </div>
      </form>
    </div>
  )
}

export default ChatInputForm
