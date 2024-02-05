import { createReadStream } from 'fs-extra'
import csv from 'csv-parser'

import { ProcessCsv, ProcessCsvResponse, TranasctionType, Transaction } from '@shared/types'
import { AIB_HEADERS } from '@shared/constants'

const getMonth = (date: string) => {
  //month is dd/mm/year
  const values = date.split('/')
  switch (values[1]) {
    default:
      return undefined
    case '01':
      return 'January'
    case '02':
      return 'February'
    case '03':
      return 'March'
    case '04':
      return 'April'
    case '05':
      return 'May'
    case '06':
      return 'June'
    case '07':
      return 'July'
    case '08':
      return 'August'
    case '09':
      return 'September'
    case '10':
      return 'October'
    case '11':
      return 'November'
    case '12':
      return 'December'
  }
}

const getYear = (date: string) => {
  const values = date.split('/')

  return values[2]
}

const readCsvFile = (path: string, month: string, year: string) => {
  const stream = createReadStream(path, { encoding: 'utf-8' })

  return new Promise<Record<string, string>[]>((resolve, reject) => {
    const transactions: Record<string, string>[] = []

    stream
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        const date = row[AIB_HEADERS.DATE]
        const amount = parseFloat(row[AIB_HEADERS.DEBIT_AMOUNT] || row[AIB_HEADERS.CREDIT_AMOUNT])

        if (amount > 0 && getMonth(date) === month && getYear(date) === year) {
          // console.log('amount', {
          //   amount,
          //   debit: row[AIB_HEADERS.DEBIT_AMOUNT],
          //   credit: row[AIB_HEADERS.CREDIT_AMOUNT]
          // })

          transactions.push(row)
        }
      })
      .on('finish', () => resolve(transactions))
      .on('error', reject)
  })
}

const parseTransactions = (input: Record<string, string>[]) => {
  const transactions: Transaction[] = input.map((item) => {
    const { CREDIT_AMOUNT, DATE, DEBIT_AMOUNT, DESCRIPTION, TRANSACTION_TYPE } = AIB_HEADERS
    const amount = parseFloat(item[DEBIT_AMOUNT] || item[CREDIT_AMOUNT])

    return {
      date: item[DATE],
      title: item[DESCRIPTION],
      amount,
      transactionType: item[TRANSACTION_TYPE] as TranasctionType,
      description: '',
      isPersonal: false,
      category: ''
    }
  })

  return transactions
}

export const processCsv: ProcessCsv = async (path, month, year) => {
  const transactions = await readCsvFile(path, month, year)

  const parsedTransactions = parseTransactions(transactions)

  const d = new Date()

  return {
    monthName: month,
    year: d.getFullYear().toString(),
    parsedTransactions
  } as ProcessCsvResponse
}
