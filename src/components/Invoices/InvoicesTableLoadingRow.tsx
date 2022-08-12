const InvoicesTableLoadingRow = () => {
  return (
    <tr className="cursor-pointer hover:bg-gray-50 overflow-visible animate-pulse">
      <td className="w-full max-w-0 py-5 pl-4 pr-3 text-sm  text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
        <div className="flex items-center justify-between sm:space-x-3" style={{ minWidth: 170 }}>
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="flex-1 truncate hidden sm:block">
            <div className="text-gray-800 text-sm truncate h-2.5 bg-gray-300 w-[100px] rounded-sm mb-1.5" />
            <div className="h-1.5 w-[60px] bg-gray-200 rounded-sm" />
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell truncate space-y-2">
        <div className="text-sm  uppercase bg-gray-200 h-1.5 w-[30px] opacity-50 rounded-sm"></div>
        <div className="h-2 w-[200px] bg-gray-200 rounded-sm" />
      </td>
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-1.5 w-[75px] bg-gray-300 mb-1.5 rounded-sm" />
        <div className="h-1.5 w-[60px] bg-gray-200 rounded-sm" />
      </td>
      <td className="px-3 py-4 text-sm  min-w-md">
        <div className="h-3 rounded-lg w-[35px] bg-gray-100" />
      </td>
      <td className="px-3 py-4 text-sm truncate">
        <div className="h-3 rounded-lg w-[90px] bg-gray-100" />
      </td>

      <td className="px-3 py-4 text-sm truncate">
        <div className="h-3 rounded-lg w-[90px] bg-gray-100" />
      </td>

      <td className="px-3 py-4 text-sm truncate">
        <div className="h-3 rounded-lg w-[90px] bg-green-100" />
      </td>
    </tr>
  )
}

export default InvoicesTableLoadingRow
