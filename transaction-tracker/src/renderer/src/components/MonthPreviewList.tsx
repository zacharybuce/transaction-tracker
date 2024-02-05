import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import MonthPreview from './MonthPreview'
import { useTrackerProvider } from '@renderer/providers/TrackerProvider'

const MonthPreviewList = ({ className, ...props }: ComponentProps<'ul'>) => {
  const { monthInfo, currentlySelectedMonth, setCurrentlySelectedMonth } = useTrackerProvider()

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
          key={`${index} + ${month}`}
          isActive={currentlySelectedMonth === index}
          onClick={() => setCurrentlySelectedMonth(index)}
          monthName={month.monthName}
          year={month.year}
          totalSaved={month.totalSaved}
        />
      ))}
    </ul>
  )
}

export default MonthPreviewList
