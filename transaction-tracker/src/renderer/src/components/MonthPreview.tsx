import { ComponentProps } from 'react'
import { AiFillCaretUp, AiFillCaretDown } from 'react-icons/ai'

import { cn, format } from '@renderer/utils'

const MonthPreview = ({
  isActive = false,
  monthName,
  year,
  className,
  totalSaved,
  ...props
}: {
  monthName: string
  year: string
  isActive?: boolean
  totalSaved: number
} & ComponentProps<'div'>) => {
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
      <div
        className={`inline-block w-full mb-2 text-xs font-light text-left ${totalSaved > 0 ? 'text-green-300' : 'text-red-300'}`}
      >
        <div className={`float-left w-[7%] flex flex-row items-center h-[1rem]`}>
          {totalSaved > 0 ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </div>
        <div className="float-right w-[93%]">{format(totalSaved)}</div>
      </div>
    </div>
  )
}

export default MonthPreview
