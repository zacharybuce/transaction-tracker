import { useTrackerProvider } from '@renderer/providers/TrackerProvider'
import Dropdown from './generalUi/Dropdown'
import { ChangeEvent, useCallback, useState } from 'react'
import TextInput from './generalUi/TextInput'
import IconDropdown from './generalUi/IconDropdown'
import { OPTIONS } from '@shared/constants'
import { TranasctionType } from '@shared/types'
import { manualAddTransaction } from '@renderer/utils'

const ModalHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 md:p-5 border-b border-solid border-blueGray-200 rounded-t">
      <h3 className="text-lg font-semibold text-white">Add Transactions CSV</h3>
    </div>
  )
}

const ModalFooter = ({
  onClose,
  onConfirm,
  loading
}: {
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) => {
  return (
    <div className="flex items-center justify-end p-6">
      {!loading ? (
        <>
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={onConfirm}
          >
            Create
          </button>
        </>
      ) : (
        <div className="italic">processing...</div>
      )}
    </div>
  )
}

const AddTransactionModal = () => {
  const {
    showAddTransactionsModal,
    setShowAddTransactionsModal,
    currentlySelectedMonth,
    monthInfo
  } = useTrackerProvider()

  const [transactionName, setTransactionName] = useState<string>('')
  const [transactionCategory, setTransactionCategory] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [transactionType, setTransactionType] = useState<TranasctionType>('Debit')
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setShowAddTransactionsModal(false)
  }, [setShowAddTransactionsModal])

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTransactionName(e.target.value)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (transactionName && transactionCategory && amount) {
      setLoading(true)
      const monthId = `${monthInfo[currentlySelectedMonth].monthName}-${monthInfo[currentlySelectedMonth].year}`

      await manualAddTransaction({
        transactionName,
        transactionCategory,
        amount,
        transactionType,
        transactions: monthInfo[currentlySelectedMonth].transactions,
        monthId,
        totalSaved: monthInfo[currentlySelectedMonth].totalSaved
      })
      setLoading(false)
      handleClose()
    }
  }, [
    amount,
    currentlySelectedMonth,
    handleClose,
    monthInfo,
    transactionCategory,
    transactionName,
    transactionType
  ])

  const onTransactionCategoryChange = useCallback((value: string) => {
    setTransactionCategory(value)
  }, [])

  const onAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }, [])

  const onTransactionTypeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setTransactionType(e.target.value as TranasctionType)
  }, [])

  if (!showAddTransactionsModal) {
    return <></>
  }

  return (
    <>
      <div
        tabIndex={-1}
        aria-hidden="true"
        className="flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-zinc-800 rounded-lg shadow">
            <ModalHeader />
            <div className="grid gap-4 grid-cols-5 px-6 py-2">
              <div className="col-span-4">
                <TextInput
                  label="Transaction Name"
                  onChange={handleTextChange}
                  value={transactionName}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-medium text-white">Category</label>
                <div className="flex flex-col justify-center items-center">
                  <IconDropdown
                    currentValue={transactionCategory}
                    onChange={onTransactionCategoryChange}
                    options={OPTIONS}
                  />
                </div>
              </div>
              <div className="col-span-3">
                <TextInput label="Amount" onChange={onAmountChange} value={amount} />
              </div>
              <div className="col-span-2">
                <Dropdown
                  label="Type"
                  onChange={onTransactionTypeChange}
                  options={['Debit', 'Credit']}
                  currentValue={transactionType}
                />
              </div>
            </div>
            <ModalFooter onClose={handleClose} onConfirm={handleConfirm} loading={loading} />
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default AddTransactionModal
