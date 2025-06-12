import React from 'react'

interface CardSectionProps {
  children: React.ReactNode
  className?: string
}

export function CardSection({ children, className }: CardSectionProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

interface CardSubSectionProps {
  children: React.ReactNode
  className?: string
}

export function CardSubSection({ children, className }: CardSubSectionProps) {
  return (
    <div
      className={`p-3 bg-gray-50 ring-1 ring-gray-200/50 dark:bg-gray-700/50 rounded-lg ${className}`}
    >
      {children}
    </div>
  )
}
