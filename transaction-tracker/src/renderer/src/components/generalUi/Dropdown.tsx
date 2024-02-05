const Dropdown = ({
  label,
  onChange,
  options,
  currentValue
}: {
  label: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  currentValue: string
}) => {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label className="block mb-2 text-sm font-medium text-white">{label}</label>
      <select
        onChange={(e) => onChange(e)}
        value={currentValue}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
