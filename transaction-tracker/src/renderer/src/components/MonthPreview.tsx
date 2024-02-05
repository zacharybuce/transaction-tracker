import { cn } from '@renderer/utils'
import { ComponentProps } from 'react'

const MonthPreview = ({
  isActive = false,
  monthName,
  year,
  className,
  ...props
}: { monthName: string; year: string; isActive?: boolean } & ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'cursor-pointer px-2.5 py-3 rounded-md transition-colors duration-75',
        {
          'bg-zinc-400/75': isActive,
          'hover:bg-zinc-500/75': !isActive
        },
        className
      )}
      {...props}
    >
      <h3 className="mb-1 font-bold truncate">{`${monthName} ${year}`}</h3>
      <span className="inline-block w-full mb-2 text-xs font-light text-left">{'subtext'}</span>
    </div>
  )
}

export default MonthPreview
