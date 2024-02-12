import { createReadStream } from 'fs-extra'
import csv from 'csv-parser'

import { Bank, ProcessCsv, ProcessCsvResponse, TranasctionType, Transaction } from '@shared/types'
import { AIB_HEADERS, REVOLUT_HEADERS } from '@shared/constants'

const getMonthAIB = (date: string) => {
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

const getYearAIB = (date: string) => {
  const values = date.split('/')

  return (parseInt(values[2], 10) + 2000).toString()
}

const getMonthRevolut = (date: string) => {
  //date is yyyy-mm-dd with time

  const month = date.split('-')[1]

  switch (month) {
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

const getYearRevolut = (date: string) => {
  const year = date.split('-')[0]

  return year
}

const readCsvFileAIB = (path: string, month: string, year: string) => {
  const stream = createReadStream(path, { encoding: 'utf-8' })

  return new Promise<Record<string, string>[]>((resolve, reject) => {
    const transactions: Record<string, string>[] = []
    stream
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        const date = row[AIB_HEADERS.DATE]
        const amount = parseFloat(row[AIB_HEADERS.DEBIT_AMOUNT] || row[AIB_HEADERS.CREDIT_AMOUNT])

        if (amount > 0 && getMonthAIB(date) === month && getYearAIB(date) === year) {
          transactions.push(row)
        }
      })
      .on('finish', () => resolve(transactions))
      .on('error', reject)
  })
}

const readCsvFileRevolut = (path: string, month: string, year: string) => {
  const stream = createReadStream(path, { encoding: 'utf-8' })

  return new Promise<Record<string, string>[]>((resolve, reject) => {
    const transactions: Record<string, string>[] = []
    stream
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        const date = row[REVOLUT_HEADERS.DATE]

        if (getMonthRevolut(date) === month && getYearRevolut(date) === year) {
          transactions.push(row)
        }
      })
      .on('finish', () => resolve(transactions))
      .on('error', reject)
  })
}

const parseTransactionsAIB = (input: Record<string, string>[]) => {
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

const parsedTransactionsRevolut = (input: Record<string, string>[]) => {
  const transactions: Transaction[] = input.map((item) => {
    const { AMOUNT, DATE, DESCRIPTION } = REVOLUT_HEADERS
    const amount = parseFloat(item[AMOUNT])

    return {
      date: item[DATE],
      title: item[DESCRIPTION],
      amount: Math.abs(amount),
      transactionType: amount < 0 ? 'Debit' : ('Credit' as TranasctionType),
      description: '',
      isPersonal: false,
      category: ''
    }
  })

  return transactions
}

const readCsvFile = (path: string, month: string, year: string, bank: Bank) => {
  switch (bank) {
    default:
    case 'Revolut':
      return readCsvFileRevolut(path, month, year)
    case 'AIB':
      return readCsvFileAIB(path, month, year)
  }
}

const parseTransactions = (input: Record<string, string>[], bank: Bank) => {
  switch (bank) {
    default:
    case 'Revolut':
      return parsedTransactionsRevolut(input)
    case 'AIB':
      return parseTransactionsAIB(input)
  }
}

export const processCsv: ProcessCsv = async (path, month, year, bank) => {
  const transactions = await readCsvFile(path, month, year, bank)
  const parsedTransactions = parseTransactions(transactions, bank)

  return {
    monthName: month,
    year,
    parsedTransactions
  } as ProcessCsvResponse
}
