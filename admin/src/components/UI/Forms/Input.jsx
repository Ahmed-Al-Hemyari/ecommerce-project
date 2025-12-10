import React from 'react'

const Input = ({
    width = 'w-full',
    label = '',
    additionalText = '',
    important = false,
    type = '',
    placeholder = '',
    value,
    setValue,
    formError,
    inputError,
    disabled = false
}) => {
  return (
    <div>
        <label className="block mb-1 font-medium">{label}{' '}
            {important && <span className='text-red-500'>*</span>}
        </label>
        <p className="text-sm text-gray-500 italic my-1">
            {additionalText}
        </p>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            className={`${width} ${disabled && 'bg-gray-50'} px-4 py-2 rounded-lg border ${formError || inputError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
        />
    </div>
  )
}

export default Input