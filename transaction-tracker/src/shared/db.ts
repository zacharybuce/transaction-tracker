import Dexie, { Table } from 'dexie'
import { Expense, Month, Transaction } from './types'

export class MySubClassedDexie extends Dexie {
  // These are added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  months!: Table<Month>
  transactions!: Table<Transaction>
  expenses!: Table<Expense>

  constructor() {
    super('myDatabase')
    this.version(2).stores({
      months: ', monthName, year, transactions, totalSaved',
      transactions: '++id, date, title, amount, transactionType, description, isPersonal, category',
      expenses: ', transactionType, isPersonal, nickname'
    })
  }
}

export const db = new MySubClassedDexie()
