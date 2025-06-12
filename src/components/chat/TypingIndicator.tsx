export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-3 p-4">
      <div className="flex items-center space-x-2">
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>

        {/* AI avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">AI is working...</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Fetching your accounting data
        </div>
      </div>
    </div>
  )
}
