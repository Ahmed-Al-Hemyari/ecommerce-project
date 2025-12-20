import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const colorMap = {
  yellow: 'text-yellow-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  green: 'text-green-600',
  red: 'text-red-600',
};

const Dropdown = ({
  label,
  placeholder = 'Select...',
  options = [],
  value,
  setValue,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => o._id === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative w-52 min-w-fit" ref={ref}>
      {label && (
        <label className="block mb-1 font-medium text-sm">{label}</label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
        className={`
          w-full flex items-center justify-between
          px-4 py-2 rounded-full border bg-white border-gray-200
          hover:border-gray-300 transition
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className={selected ? colorMap[selected.color] : 'text-gray-400'}>
          {selected?.name || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option._id}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                setValue(option._id);
                setOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-base
                hover:bg-gray-100 transition
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${colorMap[option.color] || 'text-gray-700'}
              `}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;




// import React from 'react';

// const Dropdown = ({
//   options = [],
//   placeholder = 'Select',
//   value,
//   setValue,
//   compact = false,
// }) => {
//   return (
//     <select
//       className={`
//         ${compact ? 'h-9 px-3 text-base' : 'h-11 px-4'}
//         min-w-[140px]
//         rounded-lg
//         bg-white
//         border border-(--color-light-gray)
//         transition
//         hover:border-gray-400
//         focus:outline-none
//         focus:ring-1 focus:ring-(--color-green)
//       `}
//       value={value ?? ''}
//       onChange={(e) =>
//         setValue(e.target.value === '' ? null : e.target.value)
//       }
//     >
//       <option value="" disabled>
//         {placeholder}
//       </option>

//       {options.map(option => (
//         <option key={option._id} value={option._id}>
//           {option.name}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Dropdown;
