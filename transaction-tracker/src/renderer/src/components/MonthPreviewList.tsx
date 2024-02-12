import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import MonthPreview from './MonthPreview'
import { useTrackerProvider } from '@renderer/providers/TrackerProvider'
import { Month, MonthName } from '@shared/types'
import { MONTHS } from '@shared/constants'

const monthSort = (a: Month, b: Month) => {
  const aYear = parseInt(a.year)
  const bYear = parseInt(b.year)

  if (aYear > bYear) {
    return -1
  } else if (aYear < bYear) {
    return 1
  } else {
    const aMonth = MONTHS.indexOf(a.monthName as MonthName)
    const bMonth = MONTHS.indexOf(b.monthName as MonthName)

    return (aMonth - bMonth) * -1
  }
}

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
      {monthInfo.sort(monthSort).map((month, index) => (
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
