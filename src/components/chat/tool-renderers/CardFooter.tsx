interface CardFooterProps {
  updatedAt: string
  id: string
}

export function CardFooter({ updatedAt, id }: CardFooterProps) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Updated: {new Date(updatedAt).toLocaleDateString()}
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
        ID: {id.slice(0, 8)}...
      </span>
    </div>
  )
}
