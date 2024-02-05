import { DragEvent, useCallback, useState } from 'react'
import { AiOutlineUpload, AiFillDelete } from 'react-icons/ai'

import { useTrackerProvider } from '@renderer/providers/TrackerProvider'
import IconButton from './buttons/IconButton'
import { addProcessedCsvResponse } from '@renderer/utils'
import { MonthName } from '@shared/types'
import Dropdown from './generalUi/Dropdown'

const MONTHS: MonthName[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const YEARS = ['2023', '2024', '2025', '2026', '2027']

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
            Confirm
          </button>
        </>
      ) : (
        <div className="italic">processing...</div>
      )}
    </div>
  )
}

const DropZone = ({ handleDrop }: { handleDrop: (e: DragEvent) => void }) => {
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div className="relative p-6 flex-auto">
      <div
        className="border border-white border-dashed w-[40vw] h-[30vh] rounded justify-center items-center flex flex-row"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <AiOutlineUpload size={'6rem'} />
      </div>
    </div>
  )
}

const FilePreview = ({ file, handleDeleteFile }: { file: File; handleDeleteFile: () => void }) => {
  return (
    <div className="p-6">
      <div className="w-[40vw] h-[30vh] relative flex-auto">
        <div className="h-[40px]">
          <div className="rounded p-2 bg-zinc-900 text-ellipsis overflow-hidden float-start w-[89%]">
            {file.name}
          </div>
          <IconButton onClick={handleDeleteFile}>
            <AiFillDelete size={'20'} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

const getCurrentMonthAndYear = () => {
  const d = new Date()
  const prevMonth = d.getMonth() - 1 === 0 ? 12 : d.getMonth() - 1

  return { month: MONTHS[prevMonth], year: d.getFullYear().toString() }
}

const AddTransactionModal = () => {
  const { showAddTransactionsModal, setShowAddTransactionsModal } = useTrackerProvider()

  const [file, setFile] = useState<File | undefined>(undefined)
  const [monthDropdownValue, setMonthDropdownValue] = useState<MonthName>(
    getCurrentMonthAndYear().month
  )
  const [yearDropdownValue, setYearDropdownValue] = useState<string>(getCurrentMonthAndYear().year)
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setShowAddTransactionsModal(false)
    setFile(undefined)
  }, [setShowAddTransactionsModal])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const fileToUse = e.dataTransfer.files[0]

    if (fileToUse.name.split('.').pop() !== 'csv') {
      return
    }

    setFile(fileToUse)
  }, [])

  const handleDeleteFile = useCallback(() => {
    setFile(undefined)
  }, [])

  const handleMonthDropdownSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthDropdownValue(e.target.value as MonthName)
  }, [])

  const handleYearDropdownSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearDropdownValue(e.target.value)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (file && monthDropdownValue && yearDropdownValue) {
      setLoading(true)
      //@ts-expect-error path exists on file type
      const path = file.path

      const res = await window.context.processCsv(path, monthDropdownValue, yearDropdownValue)
      if (res) {
        await addProcessedCsvResponse(res)
        console.log('success!')
        setLoading(false)
        handleClose()
      }
    }
  }, [file, handleClose, monthDropdownValue, yearDropdownValue])

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
            <div className="grid gap-4 grid-cols-2 px-6 py-2">
              <Dropdown
                label="Month"
                onChange={handleMonthDropdownSelect}
                options={MONTHS}
                currentValue={monthDropdownValue}
              />
              <Dropdown
                label="Year"
                onChange={handleYearDropdownSelect}
                options={YEARS}
                currentValue={yearDropdownValue}
              />
            </div>
            {file ? (
              <FilePreview file={file} handleDeleteFile={handleDeleteFile} />
            ) : (
              <DropZone handleDrop={handleDrop} />
            )}
            <ModalFooter onClose={handleClose} onConfirm={handleConfirm} loading={loading} />
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default AddTransactionModal
