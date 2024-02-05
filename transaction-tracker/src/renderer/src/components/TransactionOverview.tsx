import { format } from '@renderer/utils'
import { Transaction } from '@shared/types'
import { useMemo } from 'react'

const AmountDisplay = ({
  title,
  amount,
  color
}: {
  title: string
  amount: number
  color: 'red' | 'green'
}) => {
  return (
    <div className="text-center rounded bg-zinc-600 p-2 w-full">
      <div className={`font-bold ${color === 'red' ? 'text-red-300' : 'text-green-300'}`}>
        {format(amount)}
      </div>
      <div className="text-sm">{title}</div>
    </div>
  )
}

const TransactionOverview = ({ transactions }: { transactions: (Transaction | undefined)[] }) => {
  const { totalSpent, nonPersonal, totalSaved } = useMemo(() => {
    let totalSpent = 0
    let nonPersonal = 0
    let totalSaved = 0

    transactions.forEach((transaction) => {
      if (transaction) {
        if (transaction.transactionType === 'Debit') {
          totalSpent += transaction.amount
          totalSaved -= transaction.amount
          if (!transaction.isPersonal) {
            nonPersonal += transaction.amount
          }
        } else {
          totalSaved += transaction.amount
        }
      }
    })

    return { totalSpent, nonPersonal, totalSaved }
  }, [transactions])

  return (
    <div className="sticky top-0 z-10 bg-[#242427] px-10 py-5">
      <div className="flex justify-between gap-2">
        <AmountDisplay
          amount={totalSaved}
          title="Total Saved"
          color={totalSaved > 0 ? 'green' : 'red'}
        />
        <AmountDisplay amount={totalSpent} title="Total Spent" color="red" />
        <AmountDisplay amount={nonPersonal} title="Shared Expense" color="red" />
      </div>
    </div>
  )
}

export default TransactionOverview
