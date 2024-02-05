import { format } from '@renderer/utils'
import { Transaction } from '@shared/types'
import { useState } from 'react'

const TransactionPreview = ({ transaction }: { transaction: Transaction }) => {
  const [personal, setPersonal] = useState(transaction.isPersonal)

  return (
    <div className="border-t border-gray-400 px-5 py-2 grid grid-cols-5">
      <div className="col-span-2">{transaction.title}</div>
      <div
        className={`col-span-1 ${transaction.transactionType === 'Credit' ? 'text-green-300' : 'text-red-300'}`}
      >
        {transaction.transactionType === 'Debit' ? '- ' : '+ '}
        {format(transaction.amount)}
      </div>
      <div className="col-span-1 text-center">-</div>
      <div className="col-span-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={personal}
            className="sr-only peer"
            onChange={() => setPersonal((prev) => !prev)}
          />
          <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 :peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm text-gray-300">Personal</span>
        </label>
      </div>
    </div>
  )
}

export default TransactionPreview
