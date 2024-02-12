import { MonthName } from './types'

export const AIB_HEADERS = {
  DATE: ' Posted Transactions Date',
  DESCRIPTION: ' Description',
  DEBIT_AMOUNT: ' Debit Amount',
  CREDIT_AMOUNT: ' Credit Amount',
  TRANSACTION_TYPE: 'Transaction Type'
}

export const REVOLUT_HEADERS = {
  DATE: 'Started Date',
  DESCRIPTION: 'Description',
  AMOUNT: 'Amount'
}

export const MONTHS: MonthName[] = [
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

export const OPTIONS = [
  { value: 'Groceries', iconCode: '\uE8CC' },
  { value: 'Bills', iconCode: '\uEF63' },
  { value: 'House', iconCode: '\uE88A' },
  { value: 'Leisure', iconCode: '\uEB3E' },
  { value: 'Travel', iconCode: '\uE6CA' },
  { value: 'Health', iconCode: '\uE548' }
]
