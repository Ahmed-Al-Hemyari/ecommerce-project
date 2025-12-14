import React, { useState, useRef, useEffect } from "react";

const SearchableDropdown = ({
  label = "",
  important = false,
  options = [],
  placeholder = "Select...",
  value,
  setValue,
  formError,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o._id === value);

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <label className="block mb-1 font-medium">
        {label} {important && <span className="text-red-500">*</span>}
      </label>

      {/* Input */}
      <div
        className={`w-full px-4 py-2 rounded-lg border cursor-pointer bg-white
          ${formError ? "border-red-500" : "border-(--color-light-gray)"}`}
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.name : placeholder}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 w-full bg-white border rounded-lg mt-1 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b focus:outline-none"
          />

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  onClick={() => {
                    setValue(option._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {option.name ?? option.title}
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-400">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;