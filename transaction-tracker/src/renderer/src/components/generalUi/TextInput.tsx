import { ChangeEvent } from 'react'

const TextInput = ({
  label,
  placeholder,
  onChange,
  value
}: {
  label: string
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  value: string
}) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-white">{label}</label>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder={placeholder}
        required
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

export default TextInput
