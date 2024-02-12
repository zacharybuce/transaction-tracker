import { AiOutlineFileAdd } from 'react-icons/ai'

import { ActionButton } from './ActionButton'
import { useTrackerProvider } from '@renderer/providers/TrackerProvider'

const AddTransactionsButton = () => {
  const { setShowUploadCsvModal } = useTrackerProvider()

  return (
    <ActionButton
      onClick={() => {
        setShowUploadCsvModal(true)
      }}
    >
      <AiOutlineFileAdd />
    </ActionButton>
  )
}

export default AddTransactionsButton
