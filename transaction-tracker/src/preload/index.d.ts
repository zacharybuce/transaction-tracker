import { ProcessCsv } from '@shared/types'

declare global {
  interface Window {
    context: {
      processCsv: ProcessCsv
    }
  }
}
