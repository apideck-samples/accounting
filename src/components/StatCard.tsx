import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  name: string
  amount: number | string
  href: string
  linkText: string
  icon: ReactNode
  isLoading: boolean
}

const StatCard = ({ name, amount, href, linkText, icon, isLoading }: Props) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg fade-up">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
              <dd>
                <div
                  className={`text-lg font-medium text-gray-900 ${
                    isLoading ? 'animate-pulse' : ''
                  }`}
                >
                  {isLoading ? '...' : amount}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-3">
        <div className="text-sm">
          <Link href={href}>
            <a className="font-medium text-primary-700 hover:text-primary-900">{linkText}</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StatCard
