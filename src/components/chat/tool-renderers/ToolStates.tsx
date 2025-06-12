export function ToolLoading({ toolName }: { toolName: string }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-300 rounded-full animate-spin"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      </div>

      {toolName?.includes('list') || toolName?.includes('List') ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 space-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ToolError({ error }: { error: any }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-2">
        <span className="text-red-500">❌</span>
        <span className="font-medium">Error</span>
      </div>
      <div className="mt-1">{error}</div>
    </div>
  )
}

export function NoData() {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg text-sm border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center gap-2">
        <span className="text-yellow-500">⚠️</span>
        <span className="font-medium">No Data</span>
      </div>
      <div className="mt-1">No data available</div>
    </div>
  )
}

export function EmptyResult({ toolName }: { toolName: string }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2">
        <span className="text-blue-500">📭</span>
        <span className="font-medium">Empty Results</span>
      </div>
      <div className="mt-1">No {toolName.replace('list', '').toLowerCase()} found</div>
    </div>
  )
}
