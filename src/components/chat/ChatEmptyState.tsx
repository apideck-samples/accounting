import { EXAMPLE_PROMPTS } from './constants'

interface ChatEmptyStateProps {
  onExampleClick: (prompt: string) => void
}

export function ChatEmptyState({ onExampleClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
      <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Ask me anything!</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          I can help you with your accounting data
        </p>
      </div>

      <div className="space-y-4 w-full">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Try these examples:</p>
        <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onExampleClick(prompt)}
              className="text-left p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <span className="text-primary-500 mr-2">✨</span>
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
