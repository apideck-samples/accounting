const CreditNotesTableLoadingRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium sm:w-auto sm:max-w-none sm:pl-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </td>
      <td className="hidden px-3 py-4 text-sm sm:table-cell">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </td>
      <td className="hidden px-3 py-4 text-sm lg:table-cell">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </td>
      <td className="px-3 py-4 text-sm">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </td>
      <td className="px-3 py-4 text-sm">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </td>
      <td className="px-3 py-4 text-sm">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </td>
    </tr>
  )
}

export default CreditNotesTableLoadingRow
