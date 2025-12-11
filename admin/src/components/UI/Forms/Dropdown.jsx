import React from 'react'

const Dropdown = ({
  label = '',
  important = false,
  options = [],
  placeholder,
  value,
  setValue,
  formError,
}) => {
  return (
    <div className='mb-4'>
      <label className="block mb-1 font-medium">
        {label}{' '}
        {important && <span className='text-red-500'>*</span>}
      </label>

      <select
        className={`w-full px-4 py-2 rounded-lg border 
          ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} 
          focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
