import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ActionButton from './ActionButton';
import { Edit, Check, Trash2 } from 'lucide-react'
import { AiFillCheckCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const ShippingCard = ({ shipping, onSetDefault, onDelete }) => {
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
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete shipping?",
      text: "This will permanently delete this shipping address.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d50101",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      preConfirm: async () => {
        Swal.showLoading();
        try {
          setLoading(true);
          await onDelete(_id); // Call parent callback
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
        text: "Shipping deleted successfully",
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
    >
      <div className="flex justify-between items-stretch">
        <div>
          <p className="font-medium text-gray-800">{address1}</p>
          {address2 && <p className="text-gray-500">{address2}</p>}
          <p className="text-gray-500">{city}, {zip}</p>
          <p className="text-gray-500">{country}</p>
        </div>
        <div className='flex flex-col justify-between items-center'>
          {isDefault ? (
            <div className="flex items-center gap-1 text-green-500 font-medium">
              <AiFillCheckCircle size={18}/>
            </div>
          ) : (

            <ActionButton
              Icon={Check}
              tooltip={'Make Default'}
              size={18}
              color="#333333"
              handleClick={handleSetDefault}
              />
            )}
          <ActionButton
            Icon={Edit}
            tooltip={'Edit Shipping'}
            size={18}
            color="#333333"
            handleClick={() => navigate(`/profile/shippings/edit/${_id}`)}
            />
          <ActionButton
            Icon={Trash2}
            tooltip={'Delete Shipping'}
            size={18}
            color="#d50101"
            handleClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingCard;
