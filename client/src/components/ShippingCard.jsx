import React, { useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import Swal from 'sweetalert2';

const ShippingCard = ({ shipping, onSetDefault }) => {
  const {
    _id,
    address1,
    address2,
    city,
    zip,
    country,
    isDefault
  } = shipping;

  const [loading, setLoading] = useState(false);

  const handleSetDefault = async () => {
    if (isDefault) return; // Already default

    const result = await Swal.fire({
      title: "Set as default shipping?",
      text: "This will make this address your default shipping address.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, set as default",
      confirmButtonColor: "#1d7451",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      preConfirm: async () => {
        Swal.showLoading();
        try {
          setLoading(true);
          await onSetDefault(_id); // Call parent callback
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Failed: ${error.message || error}`);
          return false;
        } finally {
          setLoading(false);
        }
      }
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Success",
        text: "Default shipping updated",
        icon: "success",
        confirmButtonColor: "#1d7451"
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 border transition ${
        isDefault ? 'border-green-500' : 'border-gray-200 hover:border-gray-400 cursor-pointer'
      }`}
      onClick={handleSetDefault}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800">{address1}</p>
          {address2 && <p className="text-gray-500">{address2}</p>}
          <p className="text-gray-500">{city}, {zip}</p>
          <p className="text-gray-500">{country}</p>
        </div>

        {isDefault ? (
          <div className="flex items-center gap-1 text-green-500 font-medium">
            <AiFillCheckCircle />
            <span>Default</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ShippingCard;
