import { ComponentProps } from 'react'

import AddTransactionsButton from './AddTransactionsButton'

const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <AddTransactionsButton />
    </div>
  )
}

export default ActionButtonsRow
