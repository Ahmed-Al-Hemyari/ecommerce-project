import React from "react";
import { Pencil, Copy, Trash, X, RefreshCcw, Trash2, Eye, Plus, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "./Tables/ActionButton";
import { handleAddStock, handleCancel, hardDelete, restore, softDelete } from "@/utils/Functions";
import Swal from "sweetalert2";
import { actionButtons } from "@/utils/actionButtonsMap.jsx";

const ShowCard = ({
  title,
  subtitle,
  type,
  link,
  image,
  imageAlt = "Preview",
  data = [],
  actions = [],
  deleted = false,
}) => {

  const navigate = useNavigate();
  const { id } = useParams();

  const refreshAction = async (message) => {
    await Swal.fire({
      title: message,
      icon: "success",
      confirmButtonColor: "#1d7451"
    });

    window.location.reload();
  }

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">{title} {' '} {deleted ? <span className="text-red-600 font-normal text-xl">(Deleted)</span> : ''}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(() => {
            const buttons = actionButtons(id, type, link, navigate, refreshAction);
            return actions.map(action => buttons[action] ?? null);
          })()}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {image && (
          <div className="mb-6 flex justify-center">
            <img
              src={image}
              alt={imageAlt}
              className="max-h-50 object-contain rounded-xl border bg-gray-50"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {item.label}
              </p>
              <p className="text-base font-medium text-gray-900">
                {item.value ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
