import React from 'react';
import Dropdown from './Dropdown';
import { useNavigate } from 'react-router-dom';

const Filters = ({ inputs = [] }) => {
  const navigate = useNavigate();
  const handleReset = () => {
    // window.location.reload();
    inputs.map(input => input.setValue(null));
  };


  return (
    <div className="
      w-full
      flex flex-wrap items-center justify-center gap-2
      px-2 py-1
    ">
      {inputs.map((input, index) => (
        <Dropdown
          key={index}
          options={input.options}
          placeholder={input.label}
          value={input.value}
          setValue={input.setValue}
          compact
        />
      ))}

      <button
        type="button"
        onClick={handleReset}
        className="
          text-base
          text-(--color-dark-green)
          px-2
          hover:underline
          whitespace-nowrap
        "
      >
        Reset
      </button>
    </div>
  );
};

export default Filters;
