import { DateInput, Tooltip } from '@apideck/components'

import classNames from 'classnames'

interface DateFiltersProps {
  startDate: string | null
  endDate: string | null
  setStartDate: (date: string | null) => void
  setEndDate: (date: string | null) => void
}

const DateFilters = ({ startDate, setStartDate, endDate, setEndDate }: DateFiltersProps) => {
  const handleStartDateChange = (e: any) => {
    const newStartDateString = e.target?.value || null // Ensure null if value is empty/undefined
    setStartDate(newStartDateString)
    // If new start date makes range invalid, clear end date
    if (newStartDateString && endDate && new Date(newStartDateString) > new Date(endDate)) {
      setEndDate(null)
    }
  }

  const handleEndDateChange = (e: any) => {
    const newEndDateString = e.target?.value || null // Ensure null if value is empty/undefined
    setEndDate(newEndDateString)
    // If new end date makes range invalid, clear start date
    if (newEndDateString && startDate && new Date(newEndDateString) < new Date(startDate)) {
      setStartDate(null)
    }
  }

  return (
    <div className="flex items-center justify-between space-x-3 2xl:space-x-4">
      <div className="hidden lg:flex w-full">
        <DateInput
          name="start"
          type="date"
          value={startDate || ''} // Controlled component
          onChange={handleStartDateChange}
          placeholder="Select start date"
          className="!border-gray-200"
          maxDate={endDate ? new Date(endDate) : new Date()} // Max start date is end date or today
          onClear={() => {
            setStartDate(null)
            // Optionally clear endDate too if startDate is cleared, or let user re-select
          }}
        />
      </div>
      <div className="hidden lg:flex w-full">
        <Tooltip text={!startDate ? 'First select start date' : ''} className="relative w-full">
          <DateInput
            name="end"
            type="date"
            value={endDate || ''} // Controlled component
            onChange={handleEndDateChange}
            placeholder="Select end date"
            className={classNames('!border-gray-200', {
              'cursor-not-allowed': !startDate
            })}
            minDate={startDate ? new Date(startDate) : undefined} // minDate is startDate
            maxDate={new Date()} // Max end date is today
            disabled={!startDate} // Disable if no start date
            onClear={() => setEndDate(null)}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default DateFilters
