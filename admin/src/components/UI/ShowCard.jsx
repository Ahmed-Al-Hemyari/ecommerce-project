import React from "react";
import { Pencil, ArrowLeft, Copy, Trash, X, ArchiveRestoreIcon, RefreshCcw, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ShowCard = ({
  title,
  subtitle,
  image,
  imageAlt = "Preview",
  data = [],
  onEdit,
  onRuplicate,
  onDelete,
  onHardDelete,
  onRestore,
  // onAction,
  onCancel,
  deleted,
  link,
  actions,
}) => {

  const navigate = useNavigate();
  const { id } = useParams();

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
          {onEdit && (
            <button
              onClick={() => navigate(`${link}/update/${id}`)}
              className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium bg-(--color-green) text-(--color-dark-gray) hover:bg-(--color-green)/80"
            >
              <Pencil size={16} />
            </button>
          )}
          {onRuplicate && (
            <button
              onClick={() => navigate(`${link}/create`, {
                state: {
                  id: id,
                }
              })}
              className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              <Copy size={16} />
            </button>
          )}
          {(!deleted && onDelete) && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              <Trash size={16} color="#d50101"/>
            </button>
          )}
          {(!deleted && onCancel) && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              <X size={16} color="#d50101"/>
            </button>
          )}
          {(deleted && onRestore) && (
            <>
              <button
                onClick={onRestore}
                className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
              >
                <RefreshCcw size={16}/>
              </button>
              <button
                onClick={onHardDelete}
                className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
              >
                <Trash2 size={16} color="#d50101"/>
              </button>
            </>
          )}
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

      {/* Extra actions */}
      {actions && (
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          {actions}
        </div>
      )}
    </div>
  );
};

export default ShowCard;
