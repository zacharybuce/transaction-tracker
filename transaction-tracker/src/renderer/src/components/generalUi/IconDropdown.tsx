export type Option = {
  value: string
  iconCode: string
}

const IconDropdown = ({
  onChange,
  options,
  currentValue
}: {
  onChange: (value: string) => void
  options: Option[]
  currentValue: string
}) => {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={currentValue}
      className="bg-zinc-800 border border-gray-700 text-base rounded-lg block p-1 material-symbols-outlined w-[35px] text-center"
    >
      <option value={''}>-</option>
      {options.map((option) => (
        <option value={option.value} key={option.value} title={option.value}>
          {option.iconCode}
        </option>
      ))}
    </select>
  )
}

export default IconDropdown
