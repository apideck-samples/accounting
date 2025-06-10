const PurchaseOrdersTableLoadingRow = () => {
  return (
    <tr className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 overflow-visible animate-pulse">
      {/* PO Number */}
      <td className="px-3 py-4 text-sm text-gray-900 truncate">
        <div className="h-2.5 w-[90px] bg-gray-300 dark:bg-gray-700 rounded-sm" />
      </td>
      {/* Supplier */}
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
        <div className="flex-1 truncate hidden sm:block">
          <div className="h-2.5 bg-gray-300 dark:bg-gray-700 w-[120px] rounded-sm" />
        </div>
      </td>
      {/* Issued Date */}
      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate">
        <div className="h-2 w-[75px] bg-gray-200 dark:bg-gray-600 rounded-sm" />
      </td>
      {/* Delivery Date */}
      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate">
        <div className="h-2 w-[75px] bg-gray-200 dark:bg-gray-600 rounded-sm" />
      </td>
      {/* Total */}
      <td className="px-3 py-4 text-sm font-medium">
        <div className="h-2.5 w-[60px] bg-gray-300 dark:bg-gray-700 rounded-sm" />
      </td>
      {/* Status */}
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-4 w-[60px] bg-blue-100 dark:bg-blue-800 rounded-md" />
      </td>
    </tr>
  )
}

export default PurchaseOrdersTableLoadingRow
