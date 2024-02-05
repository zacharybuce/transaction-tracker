import { AiOutlineFileAdd } from 'react-icons/ai'

import { ActionButton } from './ActionButton'
import { useTrackerProvider } from '@renderer/providers/TrackerProvider'

const AddTransactionsButton = () => {
  const { setShowAddTransactionsModal } = useTrackerProvider()

  return (
    <ActionButton
      onClick={() => {
        setShowAddTransactionsModal(true)
      }}
    >
      <AiOutlineFileAdd />
    </ActionButton>
  )
}

export default AddTransactionsButton
