import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const IconButton = ({ className, children, ...props }: ComponentProps<'button'>) => {
  return (
    <button
      className={twMerge(
        'float-end h-full hover:bg-zinc-600/50 transition-colors duration-100 rounded-full p-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
