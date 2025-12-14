import { useEffect, useState } from 'react';

const Search = ({ placeholder = 'Search products...', value, setValue }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  }

  return (
    <div className="w-full flex items-center justify-center my-3">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder='Search products...'
        className="
          w-10/12
          h-10
          px-4
          rounded-full
          border border-(--color-light-gray)
          bg-white
          text-sm
          focus:outline-none
          focus:ring-1 focus:ring-(--color-green)
        "
      />
    </div>
  );
};

export default Search;
