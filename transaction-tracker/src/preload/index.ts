import { ProcessCsv } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolated must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    processCsv: (...args: Parameters<ProcessCsv>) => ipcRenderer.invoke('processCsv', ...args)
  })
} catch (e) {
  console.log(e)
}
