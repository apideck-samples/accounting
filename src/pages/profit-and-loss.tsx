import { useConnections, useProfitAndLoss } from 'hooks'

import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import PageHeading from 'components/PageHeading'
import DateFilters from 'components/ProfitAndLoss/DateFilters'
import ProfitAndLoss from 'components/ProfitAndLoss/ProfitAndLoss'
import ProfitAndLossStats from 'components/ProfitAndLoss/ProfitAndLossStats'
import TotalProfitAndLoss from 'components/ProfitAndLoss/TotalProfitAndLoss'
import { NextPage } from 'next'
import { withSession } from 'utils'

const ProfitAndLossPage: NextPage = () => {
  const { connection } = useConnections()

  const {
    profitAndLoss,
    isLoading,
    startDate,
    setStartDate,
    setEndDate,
    endDate,
    isError,
    errorMessage
  } = useProfitAndLoss()

  return (
    <ConnectionRequiredLayout
      title="Profit and Loss"
      description={`Profit & loss report from ${connection?.name || 'your business'}`}
    >
      <PageHeading
        title="Profit and Loss"
        description={`Profit & loss report from ${connection?.name}`}
        action={
          <DateFilters
            startDate={startDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            endDate={endDate}
          />
        }
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        {isError && startDate && endDate ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Unable to load profit and loss data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {errorMessage ? (
                    <div>
                      <p className="font-medium">Error details:</p>
                      <p className="mt-1 font-mono text-xs bg-red-100 p-2 rounded border">
                        {errorMessage}
                      </p>
                    </div>
                  ) : (
                    <p>An unknown error occurred while loading the data.</p>
                  )}
                  <p className="mt-2">
                    Try selecting a different date range or contact support if the issue persists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <ProfitAndLossStats profitAndLoss={profitAndLoss} isLoading={isLoading} />
        <div className="grid 2xl:grid-cols-2 gap-8">
          <ProfitAndLoss profitAndLoss={profitAndLoss} type="income" />
          <ProfitAndLoss profitAndLoss={profitAndLoss} type="expenses" />
        </div>
        <TotalProfitAndLoss />
      </div>
    </ConnectionRequiredLayout>
  )
}

export default withSession(ProfitAndLossPage)
