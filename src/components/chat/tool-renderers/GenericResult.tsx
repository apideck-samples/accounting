export function GenericResult({ toolName, result }: { toolName: string; result: any }) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300">
        {toolName} Results:
      </h4>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm border border-gray-200 dark:border-gray-700">
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  )
}
