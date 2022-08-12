import { ReactNode } from 'react'

interface Props {
  title: string
  description?: string | ReactNode
}

const PageHeading = ({ title, description }: Props) => {
  return (
    <div className="md:flex md:items-center md:justify-between xl:py-2 lg:pt-5">
      <div className="flex-1 min-w-0">
        <h1
          className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
          data-testid="page-heading"
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-2 max-w-4xl text-sm text-gray-500"
            data-testid="page-heading-description"
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default PageHeading
