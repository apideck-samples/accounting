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

  const { profitAndLoss, isLoading, startDate, setStartDate, setEndDate, endDate } =
    useProfitAndLoss()

  return (
    <ConnectionRequiredLayout title="Profit and Loss" pageTitle="Profit and Loss">
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
