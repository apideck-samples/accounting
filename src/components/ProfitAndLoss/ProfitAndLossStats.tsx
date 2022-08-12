import { AiFillPieChart, AiOutlineAreaChart, AiOutlineUsergroupAdd } from 'react-icons/ai'

import { ProfitAndLoss } from '@apideck/node'
import StatCard from 'components/StatCard'

interface Props {
  profitAndLoss: ProfitAndLoss
  isLoading: boolean
}

const ProfitAndLossStats = ({ profitAndLoss, isLoading }: Props) => {
  const cards = [
    {
      name: 'Income',
      icon: <AiFillPieChart className="h-6 w-6 text-gray-400" aria-hidden="true" />,
      amount: `${profitAndLoss?.income?.total?.toLocaleString() ?? 0}`,
      href: '#',
      linkText: 'View income'
    },
    {
      name: 'Expenses',
      icon: <AiOutlineUsergroupAdd className="h-6 w-6 text-gray-400" aria-hidden="true" />,
      amount: `${profitAndLoss?.expenses?.total?.toLocaleString() ?? 0}`,
      href: '#',
      linkText: 'View expenses'
    },
    {
      name: 'Gross Profit',
      icon: <AiOutlineAreaChart className="h-6 w-6 text-gray-400" aria-hidden="true" />,
      amount: `${profitAndLoss?.gross_profit?.total?.toLocaleString() ?? 0}`,
      href: '#',
      linkText: 'View profit'
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

export default ProfitAndLossStats
