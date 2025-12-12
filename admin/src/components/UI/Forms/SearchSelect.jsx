import React, { useState } from "react";

const SearchSelect = ({
  placeholder,
  label,
  important,
  value,
  setValue,
  results = [],
  headers = [],
  formError,
  onSelect, // return selected user
}) => {
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setValue(text);
    setShowResults(true);
  };

  const handleSelectUser = (item) => {
    setValue(item.name);     // what input shows
    onSelect(item);          // parent receives user object
    setShowResults(false);
  };

  return (
    <div className="relative">
      <label className="block mb-1 font-medium">
        {label} {important && <span className="text-red-500">*</span>}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
        className={`w-full px-4 py-2 rounded-lg border ${
          formError ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-green-500`}
      />

      {showResults && results.length > 0 && (
        <div className="absolute bg-white border shadow-md rounded-lg w-full mt-1 max-h-60 overflow-y-auto z-50">
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {headers.map((h) => (
                <p key={h} className="text-sm">
                  <strong>{h}:</strong> {user[h]}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
