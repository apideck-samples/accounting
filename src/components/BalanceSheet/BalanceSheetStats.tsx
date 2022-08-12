import { AiFillPieChart, AiOutlineAreaChart, AiOutlineUsergroupAdd } from 'react-icons/ai'

import StatCard from 'components/StatCard'
import { useBalanceSheet } from 'hooks'

const BalanceSheetStats = () => {
  const { balanceSheet, isLoading } = useBalanceSheet()

  const cards = [
    {
      name: 'Total Assets',
      icon: <AiFillPieChart className="h-6 w-6 text-gray-400" aria-hidden="true" />,
      amount: `${balanceSheet?.assets?.total?.toLocaleString() ?? 0}`,
      href: '#',
      linkText: 'View assets'
    },
    {
      name: 'Total Equity',
      icon: <AiOutlineUsergroupAdd className="h-6 w-6 text-gray-400" aria-hidden="true" />,
      amount: `${balanceSheet?.equity?.total?.toLocaleString() ?? 0}`,
      href: '#',
      linkText: 'View equity'
    },
    {
      name: 'Total liabilities',
      icon: <AiOutlineAreaChart className="h-6 w-6 text-gray-400" aria-hidden="true" />,
      amount: `${balanceSheet?.liabilities?.total?.toLocaleString() ?? 0}`,
      href: '#',
      linkText: 'View liabilities'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
      {cards.map((card) => (
        <StatCard key={card.name} {...card} isLoading={isLoading} />
      ))}
    </div>
  )
}

export default BalanceSheetStats
