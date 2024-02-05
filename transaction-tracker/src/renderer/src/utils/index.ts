import { db } from '@shared/db'
import { Month, ProcessCsvResponse, Transaction } from '@shared/types'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

const calculateSavedAmount = (parsedTransactions: Transaction[]) => {
  let amount = 0

  parsedTransactions.forEach((transaction) => {
    if (transaction.transactionType === 'Debit') {
      amount -= transaction.amount
    }
    if (transaction.transactionType === 'Credit') {
      amount += transaction.amount
    }
  })

  return amount
}

const generateMonthId = (month: string, year: string) => {
  return `${month}-${year}`
}

export const addProcessedCsvResponse = async (res: ProcessCsvResponse) => {
  const transactionIds = await db.transactions.bulkAdd(res.parsedTransactions, { allKeys: true })

  const month: Month = {
    monthName: res.monthName,
    year: res.year,
    transactions: transactionIds as number[],
    totalSaved: calculateSavedAmount(res.parsedTransactions)
  }
  const monthId = generateMonthId(month.monthName, month.year)

  const queryRes = await db.months.get(monthId)

  if (!queryRes) {
    await db.months.add(month, monthId)
  } else {
    await db.months.update(monthId, month)
  }

  return true
}
