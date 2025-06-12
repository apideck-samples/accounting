function ReportSection({ title, value, currency, items, colorClass }: any) {
  const borderClass = `border-${colorClass}-200 dark:border-${colorClass}-800`
  const textClass = `text-${colorClass}-600 dark:text-${colorClass}-400`
  let icon

  switch (title) {
    case 'Assets':
      icon = (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      )
      break
    case 'Liabilities':
      icon = (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h2m8-4V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0V7a2 2 0 012-2h2"
          />
        </svg>
      )
      break
    case 'Equity':
      icon = (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      )
      break
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h4 className={`text-lg font-semibold ${textClass} mb-3 flex items-center`}>
        {icon}
        {title}
      </h4>
      <div className="text-right mb-3">
        <div className={`text-xl font-bold ${textClass}`}>
          {currency} {value?.toLocaleString()}
        </div>
      </div>
      <div className="space-y-2">
        {items?.map((category: any, catIndex: number) => (
          <div key={catIndex} className={`border-l-2 ${borderClass} pl-3`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
              <span className="text-gray-900 dark:text-white">
                {currency} {category.value?.toLocaleString()}
              </span>
            </div>
            {category.items && category.items.length > 0 && (
              <div className="ml-2 space-y-1">
                {category.items.slice(0, 3).map((account: any, accIndex: number) => (
                  <div
                    key={accIndex}
                    className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span>{account.name}</span>
                    <span>
                      {currency} {account.value?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {category.items.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    + {category.items.length - 3} more accounts
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function BalanceSheetReport({ result }: { result: any }) {
  const report = result?.reports?.[0]
  if (!report) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">📊</div>
        <p>No balance sheet data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {report.reportName}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>End Date: {new Date(report.endDate).toLocaleDateString()}</span>
          <span>Currency: {report.currency}</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Net Assets: {report.currency} {report.netAssets?.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ReportSection
          title="Assets"
          value={report.assets?.value}
          items={report.assets?.items}
          currency={report.currency}
          colorClass="green"
        />
        <ReportSection
          title="Liabilities"
          value={report.liabilities?.value}
          items={report.liabilities?.items}
          currency={report.currency}
          colorClass="red"
        />
        <ReportSection
          title="Equity"
          value={report.equity?.value}
          items={report.equity?.items}
          currency={report.currency}
          colorClass="blue"
        />
      </div>
    </div>
  )
}
