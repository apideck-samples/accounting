const SuppliersTableLoadingRow = () => {
  return (
    <tr className="cursor-pointer hover:bg-gray-50 overflow-visible animate-pulse">
      {/* Display Name */}
      <td className="w-full max-w-0 py-5 pl-4 pr-3 text-sm text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
        <div className="flex items-center justify-between sm:space-x-3" style={{ minWidth: 170 }}>
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="flex-1 truncate hidden sm:block">
            <div className="text-gray-800 text-sm truncate h-2.5 bg-gray-300 w-[120px] rounded-sm mb-1.5" />
            <div className="h-1.5 w-[80px] bg-gray-200 rounded-sm" />
          </div>
        </div>
      </td>
      {/* Company Name */}
      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate">
        <div className="h-2 w-[150px] bg-gray-200 rounded-sm" />
      </td>
      {/* Email */}
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-2 w-[180px] bg-gray-200 rounded-sm" />
      </td>
      {/* Phone */}
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-2 w-[100px] bg-gray-200 rounded-sm" />
      </td>
      {/* Status */}
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-4 w-[60px] bg-green-100 rounded-md" />
      </td>
      {/* Tax Number */}
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-2 w-[100px] bg-gray-200 rounded-sm" />
      </td>
    </tr>
  )
}

export default SuppliersTableLoadingRow
