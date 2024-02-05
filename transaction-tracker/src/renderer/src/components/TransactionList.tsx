import { useTrackerProvider } from '@renderer/providers/TrackerProvider'
import { getTransactions } from '@renderer/utils'
import { Transaction } from '@shared/types'
import { useCallback, useEffect, useState } from 'react'
import TransactionPreview from './TransactionPreview'
import TransactionOverview from './TransactionOverview'

const TransactionList = () => {
  const { monthInfo, currentlySelectedMonth } = useTrackerProvider()
  const [transactions, setTransactions] = useState<(Transaction | undefined)[] | undefined>()
  const [loading, setLoading] = useState(false)

  const getData = useCallback(async () => {
    if (monthInfo.length) {
      setLoading(true)
      const res = await getTransactions(monthInfo[currentlySelectedMonth].transactions)

      if (!res) {
        setTransactions([])
      } else {
        console.log(res)
        setTransactions(res)
      }
      setLoading(false)
    }
  }, [currentlySelectedMonth, monthInfo])

  useEffect(() => {
    getData()
  }, [getData])
  if (!transactions && !loading) {
    return <div className="px-3">Add transactions to start</div>
  }

  if (!transactions) {
    return <div className="px-3">loading...</div>
  }

  if (!transactions.length) {
    return <div>No transactions for this month</div>
  }

  return (
    <div>
      <TransactionOverview transactions={transactions} />
      {transactions.map((transaction, index) => {
        if (!transaction) {
          return <></>
        }

        return <TransactionPreview key={index + transaction.title} transaction={transaction} />
      })}
    </div>
  )
}

export default TransactionList
