type TextInputProps = {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number'
}

export function TextInput({ label, value, onChange, placeholder, type = 'text' }: TextInputProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

type TextAreaProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function TextArea({ label, value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <label className="field field--wide">
      <span>{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

type SelectFieldProps = {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
