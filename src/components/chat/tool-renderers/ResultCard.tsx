import React from 'react'

interface ResultCardProps {
  children: React.ReactNode
  index: number
}

export function ResultCard({ children, index }: ResultCardProps) {
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {children}
    </div>
  )
}
