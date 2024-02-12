import { format, updateIsPersonal, updateTransationType } from '@renderer/utils'
import { Transaction } from '@shared/types'
import { useCallback, useState } from 'react'
import IconDropdown from './generalUi/IconDropdown'
import { OPTIONS } from '@shared/constants'

const TransactionPreview = ({ transaction }: { transaction: Transaction }) => {
  const [personal, setPersonal] = useState(transaction.isPersonal)
  const [transactionCategory, setTransactionCategory] = useState<string>(transaction.category)

  const onCheckboxChange = useCallback(() => {
    setPersonal((prev) => {
      if (transaction.id) {
        updateIsPersonal(transaction.id, !prev)
      }
      return !prev
    })
  }, [transaction.id])

  const onTransactionCategoryChange = useCallback(
    (value: string) => {
      setTransactionCategory(value)
      if (transaction.id) {
        updateTransationType(transaction.id, transaction.title, value)
      }
    },
    [transaction.id, transaction.title]
  )

  return (
    <div className="border-t border-gray-400 px-5 py-2 grid grid-cols-5">
      <div className="col-span-2">{transaction.title}</div>
      <div
        className={`col-span-1 ${transaction.transactionType === 'Credit' ? 'text-green-300' : 'text-red-300'}`}
      >
        {transaction.transactionType === 'Debit' ? '- ' : '+ '}
        {format(transaction.amount)}
      </div>
      <div className="col-span-1 text-center">
        <IconDropdown
          currentValue={transactionCategory}
          onChange={onTransactionCategoryChange}
          options={OPTIONS}
        />
      </div>
      <div className="col-span-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={personal}
            className="sr-only peer"
            onChange={onCheckboxChange}
          />
          <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 :peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm text-gray-300">Personal</span>
        </label>
      </div>
    </div>
  )
}

export default TransactionPreview
