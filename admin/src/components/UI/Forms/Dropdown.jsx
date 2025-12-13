import React from 'react';

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
    <div>
      <label className="block mb-1 font-medium">
        {label}
        {important && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        className={`
          w-full px-4 py-2 rounded-lg border
          bg-white
          transition-colors duration-150
          hover:border-gray-400
          focus:outline-none focus:ring-2 focus:ring-(--color-green)
          ${formError ? 'border-red-500' : 'border-(--color-light-gray)'}
        `}
        value={value || ''}
        onChange={(e) => setValue(e.target.value || null)}
      >
        <option value="" disabled className="text-gray-400">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option._id}
            value={option._id}
            className="text-gray-700"
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
