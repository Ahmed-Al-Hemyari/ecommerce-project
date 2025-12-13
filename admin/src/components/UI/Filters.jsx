import { Filter } from 'lucide-react';
import React, { useState } from 'react'
import Dropdown from './Forms/Dropdown';

const Filters = ({ inputs = [] }) => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  const handleReset = () => {
    inputs.map((input) => {
      input.setValue(null);
    })
  }

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="cursor-pointer">
        <Filter color="#333333" />
      </button>

      {showMenu && (
        <div className="fixed top-auto right-3 w-50 bg-white shadow-lg flex flex-col items-center z-50 rounded-xl">
          <h2 className='p-2 text-xl font-bold'>Filters</h2>

          {inputs.map((input, index) => (
            <div key={index} className="w-full px-4 py-1">
                <Dropdown
                  label={input.label}
                  options={input.options}
                  placeholder={input.placeholder}
                  value={input.value}
                  setValue={input.setValue}
                />
            </div>
          ))}
          <div className='h-2'/>
          <div className='px-4 w-full'>
            <button 
              className='bg-(--color-green) w-full text-(--color-dark-gray) text-lg text-center font-medium rounded-md px-3 py-1'
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <div className='h-2'/>
        </div>
      )}
    </div>
  )
}

export default Filters