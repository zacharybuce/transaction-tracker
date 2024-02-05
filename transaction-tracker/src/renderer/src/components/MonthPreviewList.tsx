import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import MonthPreview from './MonthPreview'
import { useTrackerProvider } from '@renderer/providers/TrackerProvider'

const MonthPreviewList = ({ className, ...props }: ComponentProps<'ul'>) => {
  const { monthInfo, currentlySelectedMonth } = useTrackerProvider()

  if (!monthInfo.length) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No transactions yet</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>
      {monthInfo.map((month, index) => (
        <MonthPreview
          key={index}
          isActive={currentlySelectedMonth === index}
          onClick={() => null}
          monthName={month.monthName}
          year={month.year}
        />
      ))}
    </ul>
  )
}

export default MonthPreviewList
