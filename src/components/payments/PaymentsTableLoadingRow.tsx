const PaymentsTableLoadingRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
        <div className="h-2 w-[30px] bg-gray-200 rounded-sm" />
      </td>
      <td className="whitespace-nowrap px-2 py-3.5 text-sm font-medium text-gray-900">
        <div className="h-2 w-[100px] bg-gray-400 rounded-sm" />
      </td>
      <td className="whitespace-nowrap px-2 py-3.5 text-sm text-gray-900">
        <div className="h-2 w-[80px] bg-gray-200 rounded-sm" />
      </td>
      <td className="whitespace-nowrap px-2 py-3.5 text-sm text-gray-500">
        <div className="h-2 w-[60px] bg-gray-200 rounded-sm" />
      </td>
      <td className="whitespace-nowrap px-2 py-3.5 text-sm text-gray-500">
        <div className="h-2 w-[80px] bg-gray-200 rounded-sm" />
      </td>
      <td className="whitespace-nowrap px-2 py-3.5 text-sm text-gray-500">
        <div className="h-2 w-[40px] bg-gray-200 rounded-sm" />
      </td>
      <td className="relative whitespace-nowrap py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"></td>
    </tr>
  )
}

export default PaymentsTableLoadingRow
