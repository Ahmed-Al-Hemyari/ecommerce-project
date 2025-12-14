import React from 'react';

const Dropdown = ({
  options = [],
  placeholder = 'Select',
  value,
  setValue,
  compact = false,
}) => {
  return (
    <select
      className={`
        ${compact ? 'h-9 px-3 text-base' : 'h-11 px-4'}
        min-w-[140px]
        rounded-lg
        bg-white
        border border-(--color-light-gray)
        transition
        hover:border-gray-400
        focus:outline-none
        focus:ring-1 focus:ring-(--color-green)
      `}
      value={value ?? ''}
      onChange={(e) =>
        setValue(e.target.value === '' ? null : e.target.value)
      }
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map(option => (
        <option key={option._id} value={option._id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
