import { useTrackerProvider } from '@renderer/providers/TrackerProvider'
import { ActionButton } from './buttons/ActionButton'

const AddTransactionButton = () => {
  const { setShowAddTransactionsModal } = useTrackerProvider()

  return (
    <div className="px-5 py-5 flex flex-col justify-center items-center">
      <ActionButton className="w-[75%]" onClick={() => setShowAddTransactionsModal(true)}>
        Add New Transaction
      </ActionButton>
    </div>
  )
}

export default AddTransactionButton
