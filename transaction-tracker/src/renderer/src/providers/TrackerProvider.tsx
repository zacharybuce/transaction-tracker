import { db } from '@shared/db'
import { Month } from '@shared/types'
import { useLiveQuery } from 'dexie-react-hooks'
import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'

interface TrackerProviderContextProps {
  currentlySelectedMonth: number
  setCurrentlySelectedMonth: (input: number) => void
  showAddTransactionsModal: boolean
  setShowAddTransactionsModal: (input: boolean) => void
  monthInfo: Month[]
}

const TrackerProviderContext = createContext<TrackerProviderContextProps | undefined>(undefined)

export default function TrackerProvider({ children }: PropsWithChildren) {
  const monthInfo = useLiveQuery(() => db.months.toArray())

  const [currentlySelectedMonth, setCurrentlySelectedMonth] = useState<number>(0)
  const [showAddTransactionsModal, setShowAddTransactionsModal] = useState(false)

  const value = useMemo(
    () => ({
      currentlySelectedMonth,
      setCurrentlySelectedMonth,
      showAddTransactionsModal,
      setShowAddTransactionsModal,
      monthInfo: monthInfo || []
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
