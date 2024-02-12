import { useTrackerProvider } from '@renderer/providers/TrackerProvider'
import { getTransactions } from '@renderer/utils'
import TransactionPreview from './TransactionPreview'
import TransactionOverview from './TransactionOverview'
import { useLiveQuery } from 'dexie-react-hooks'

const TransactionList = () => {
  const { monthInfo, currentlySelectedMonth } = useTrackerProvider()

  const transactions = useLiveQuery(() => {
    if (monthInfo.length) {
      return getTransactions(monthInfo[currentlySelectedMonth].transactions)
    }
    return undefined
  }, [monthInfo, currentlySelectedMonth])

  if (!transactions) {
    return <div className="px-3"></div>
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
