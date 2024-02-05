export type TranasctionType = 'Debit' | 'Credit'
export type TransactionCategory = ''
export type MonthName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December'

export interface Transaction {
  id?: string
  date: string
  title: string
  amount: number
  transactionType: TranasctionType
  description: string
  isPersonal: boolean
  category: string
}

export interface Month {
  id?: string
  monthName: string
  year: string
  transactions: number[]
  totalSaved: number
}

export type ProcessCsvResponse = {
  monthName: string
  year: string
  parsedTransactions: Transaction[]
}

export type ProcessCsv = (
  path: string,
  month: MonthName,
  year: string
) => Promise<ProcessCsvResponse>
