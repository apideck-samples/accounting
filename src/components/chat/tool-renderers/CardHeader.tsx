import React from 'react'

interface CardHeaderProps {
  icon: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  badge: React.ReactNode
}

export function CardHeader({ icon, title, subtitle, badge }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {badge}
    </div>
  )
}
