import { Month } from '@shared/types'
import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'

interface TrackerProviderContextProps {
  currentlySelectedMonth: number
  setCurrentlySelectedMonth: (input: number) => void
  showAddTransactionsModal: boolean
  setShowAddTransactionsModal: (input: boolean) => void
  monthInfo: Month[]
  setMonthInfo: (input: Month[]) => void
}

const TrackerProviderContext = createContext<TrackerProviderContextProps | undefined>(undefined)

export default function TrackerProvider({ children }: PropsWithChildren) {
  const [monthInfo, setMonthInfo] = useState<Month[]>([])

  const [currentlySelectedMonth, setCurrentlySelectedMonth] = useState<number>(0)
  const [showAddTransactionsModal, setShowAddTransactionsModal] = useState(false)

  const value = useMemo(
    () => ({
      currentlySelectedMonth,
      setCurrentlySelectedMonth,
      showAddTransactionsModal,
      setShowAddTransactionsModal,
      monthInfo,
      setMonthInfo
    }),
    [currentlySelectedMonth, monthInfo, showAddTransactionsModal]
  )

  return <TrackerProviderContext.Provider value={value}>{children}</TrackerProviderContext.Provider>
}

export function useTrackerProvider() {
  const value = useContext(TrackerProviderContext)

  if (!value) {
    throw new Error('Error')
  }

  return value
}
