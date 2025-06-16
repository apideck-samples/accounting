function ReportSection({ title, total, records, currency, colorClass, isMain = false }: any) {
  const textClass = `text-${colorClass}-600 dark:text-${colorClass}-400`
  const borderClass = `border-${colorClass}-200 dark:border-${colorClass}-800`

  let icon
  switch (title) {
    case 'Income':
      icon = (
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          ></path>
        </svg>
      )
      break
    case 'Expenses':
      icon = (
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 14l6-6m-6 0l6 6"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M3 14h18"
          ></path>
        </svg>
      )
      break
    default:
      icon = null
      break
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${
        isMain ? 'col-span-1 md:col-span-2' : ''
      }`}
    >
      <h4 className={`text-lg font-semibold ${textClass} mb-3 flex items-center`}>
        {icon}
        {title}
      </h4>
      <div className="text-right mb-3">
        <div className={`text-xl font-bold ${textClass}`}>
          {currency} {total?.toLocaleString()}
        </div>
      </div>
      <div className="space-y-2">
        {records?.map((record: any, index: number) => (
          <div key={index} className={`border-l-2 ${borderClass} pl-3`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900 dark:text-white">{record.title}</span>
              <span className="text-gray-900 dark:text-white">
                {currency} {record.value?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCard({ title, value, currency, colorClass }: any) {
  const textClass = `text-${colorClass}-600 dark:text-${colorClass}-400`
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
      <h4 className={`text-lg font-semibold ${textClass}`}>{title}</h4>
      <div className={`text-2xl font-bold ${textClass}`}>
        {currency} {value?.toLocaleString()}
      </div>
    </div>
  )
}

export function ProfitAndLossReport({ result }: { result: any }) {
  if (!result) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">📊</div>
        <p>No Profit and Loss data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <svg
            className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm10 0v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zM7 7h10M7 11h4"
            ></path>
          </svg>
          {result.reportName}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {new Date(result.startDate).toLocaleDateString()} -{' '}
            {new Date(result.endDate).toLocaleDateString()}
          </span>
          <span>Currency: {result.currency}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportSection
          title="Income"
          total={result.income?.total}
          records={result.income?.records}
          currency={result.currency}
          colorClass="green"
          isMain={true}
        />
        <ReportSection
          title="Expenses"
          total={result.expenses?.total}
          records={result.expenses?.records}
          currency={result.currency}
          colorClass="red"
          isMain={true}
        />
        <SummaryCard
          title="Gross Profit"
          value={result.grossProfit?.total}
          currency={result.currency}
          colorClass="blue"
        />
        <SummaryCard
          title="Net Income"
          value={result.netIncome?.total}
          currency={result.currency}
          colorClass="purple"
        />
      </div>
    </div>
  )
}
