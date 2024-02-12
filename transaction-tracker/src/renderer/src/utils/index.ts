import { db } from '@shared/db'
import { Month, ProcessCsvResponse, TranasctionType, Transaction } from '@shared/types'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR'
})

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

const hydrateTransactions = async (transactions: Transaction[]) => {
  const newTransactions = [...transactions]

  for (let i = 0; i < newTransactions.length; i++) {
    const transaction = newTransactions[i]
    const expense = await db.expenses.get(transaction.title)

    if (!expense) {
      db.expenses.add({}, transaction.title)
    } else {
      expense.nickname ? (transaction.title = expense.nickname) : undefined
      expense.isPersonal ? (transaction.isPersonal = expense.isPersonal) : undefined
      expense.category ? (transaction.category = expense.category) : undefined

      newTransactions[i] = transaction
    }
  }

  return newTransactions
}

export const addProcessedCsvResponse = async (res: ProcessCsvResponse) => {
  const hydratedTransactions = await hydrateTransactions(res.parsedTransactions)

  const transactionIds = await db.transactions.bulkAdd(hydratedTransactions, { allKeys: true })

  const month: Month = {
    monthName: res.monthName,
    year: res.year,
    transactions: transactionIds as number[],
    totalSaved: calculateSavedAmount(hydratedTransactions)
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

export const getTransactions = async (ids: number[]) => {
  const transactions = await db.transactions.bulkGet(ids)

  return transactions
}

export const format = (amount: number) => {
  return formatter.format(amount)
}

export const updateIsPersonal = (id: number, value: boolean) => {
  db.transactions.update(id, { isPersonal: value })
}

export const updateTransationType = (transactionId: number, expenseId: string, value: string) => {
  db.transactions.update(transactionId, { category: value })
  db.expenses.update(expenseId, { category: value })
}

export const getDateNow = () => {
  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month}-${day}`
}

export const manualAddTransaction = async ({
  transactionName,
  transactionCategory,
  amount,
  transactionType,
  transactions,
  monthId,
  totalSaved
}: {
  transactionName: string
  transactionCategory: string
  amount: string
  transactionType: TranasctionType
  transactions: number[]
  monthId: string
  totalSaved: number
}) => {
  const transaction: Transaction = {
    amount: parseFloat(amount),
    title: transactionName,
    category: transactionCategory,
    isPersonal: false,
    description: '',
    transactionType,
    date: getDateNow()
  }

  const newTotalSave = totalSaved + amount

  const id = await db.transactions.add(transaction)
  await db.months.update(monthId, { transactions: [id, ...transactions], totalSaved: newTotalSave })

  return true
}
