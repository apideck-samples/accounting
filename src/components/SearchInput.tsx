import { ChangeEvent, RefObject } from 'react'

interface Props {
  value: string
  searchInputRef: RefObject<HTMLInputElement>
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autoFocus?: boolean
}

const SearchInput = ({
  value,
  searchInputRef,
  onChange,
  placeholder = 'Search',
  autoFocus
}: Props) => {
  return (
    <div className="relative">
      <div className="absolute left-0 flex items-center pt-2.5 md:pt-3 pl-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        name="search"
        type="text"
        ref={searchInputRef}
        placeholder={placeholder}
        value={value}
        className="w-full text-gray-600 border border-transparent bg-gray-100 rounded-md sm:text-sm focus:ring-transparent focus:border-gray-200 placeholder-gray-400 pl-12 md:py-2.5 lg:py-3"
        autoComplete="off"
        onChange={onChange}
        data-testid="search-input"
        autoFocus={autoFocus}
      />
    </div>
  )
}

export default SearchInput
