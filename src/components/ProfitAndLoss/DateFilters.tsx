import { DateInput, Tooltip } from '@apideck/components'

import classNames from 'classnames'

const DateFilters = ({ startDate, setStartDate, setEndDate }: any) => {
  return (
    <div className="flex items-center justify-between space-x-3 2xl:space-x-4">
      <div className="hidden lg:flex w-full">
        <DateInput
          name="start"
          type="date"
          onChange={(e: any) => {
            setStartDate(e.target?.value)
          }}
          placeholder="Select start date"
          className="!border-gray-200"
          maxDate={new Date()}
          onClear={() => setStartDate(null)}
        />
      </div>
      <div className="hidden lg:flex w-full">
        <Tooltip text={!startDate ? 'First select start date' : ''} className="relative w-full">
          <DateInput
            name="end"
            type="date"
            onChange={(e: any) => {
              setEndDate(e.target?.value)
            }}
            placeholder="Select end date"
            className={classNames('!border-gray-200', {
              'cursor-not-allowed': !startDate
            })}
            minDate={startDate || undefined}
            maxDate={new Date()}
            isRange={true}
            onClear={() => setEndDate(null)}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default DateFilters
