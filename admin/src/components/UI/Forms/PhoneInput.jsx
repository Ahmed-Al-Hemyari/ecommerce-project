import React from 'react'
import { allCountries } from 'country-telephone-data'

const PhoneInput = ({ 
    phoneLogin, 
    countryCode, 
    setCountryCode, 
    phone, 
    setPhone, 
    phoneError, 
    formError
}) => {
  return (
    <div className={phoneLogin ? 'block' : 'hidden'}>
        <label className="block mb-1 font-medium">
            Phone <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 italic my-1">
            Enter your phone number without leading zeros or extra characters.
        </p>

        <div className="flex">
            {/* Country Code Dropdown */}
            <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-3 py-2 rounded-l-lg border border-(--color-light-gray) focus:outline-none focus:ring-2 focus:ring-(--color-green)"
            >
            {allCountries.map((c, index) => (
                <option key={c.iso2} value={c.dialCode}>
                {c.iso2.toUpperCase()} ({c.dialCode})
                </option>
            ))}
            </select>

            {/* Phone Input */}
            <input
            type="tel"
            placeholder="123 456 7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-r-lg border ${
                phoneError || formError
                ? "border-red-500"
                : "border-(--color-light-gray)"
            } focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
            />
        </div>
        <p className="text-sm text-red-500 my-2">{phoneError}</p>
    </div>
  )
}

export default PhoneInput