import AddTransactionModal from './components/AddTransactionModal'
import { Content, RootLayout, Sidebar } from './components/AppLayout'
import MonthPreviewList from './components/MonthPreviewList'
import ActionButtonsRow from './components/buttons/ActionButtonsRow'
import TrackerProvider from './providers/TrackerProvider'

function App() {
  return (
    <TrackerProvider>
      <RootLayout>
        <Sidebar className="p-2 bg-zinc-800/95">
          <ActionButtonsRow className="flex justify-between mt-1" />
          <MonthPreviewList className="mt-3 space-y-1" />
        </Sidebar>
        <Content className="border-l bg-zinc-900/95 border-l-white/20"></Content>
      </RootLayout>
      <AddTransactionModal />
    </TrackerProvider>
  )
}

export default App
