// components/ShippingOption.jsx
import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";

const ShippingOption = ({ shipping, isSelected, onSelect }) => {
  const { address1, address2, city, zip, country, isDefault } = shipping;

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-xl shadow-md transition 
        ${isSelected ? "ring-2 ring-(--color-dark-green) bg-(--color-dark-green)/10" : "ring-1 ring-gray-200 hover:ring-(--color-dark-green)/50"}
      `}
    >
      <p className="font-medium text-gray-800">{address1}</p>
      {address2 && <p className="text-gray-500">{address2}</p>}
      <p className="text-gray-500">{city}, {zip}</p>
      <p className="text-gray-500">{country}</p>
      {isDefault ? (
        <div className="flex items-center gap-1 text-green-500 font-medium">
          <AiFillCheckCircle />
          <span>Default</span>
        </div>
      ) : null}
    </div>
  );
};

export default ShippingOption;
