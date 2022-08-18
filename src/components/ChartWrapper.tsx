import type { ReactNode } from 'react'

interface Props {
  title: string
  subTitle?: string
  children: ReactNode
}

const ChartWrapper = ({ title, subTitle, children }: Props) => {
  return (
    <div className=" bg-white rounded-md shadow-md">
      <div className="border-b p-5">
        <h2 className="font-bold text-xl text-gray-900 capitalize">{title}</h2>
        {subTitle && <p className="text-gray-700 text-sm">{subTitle}</p>}
      </div>
      <div className="p-5">
        <div className="h-96 flex items-center justify-center relative">{children}</div>
      </div>
    </div>
  )
}

export default ChartWrapper
