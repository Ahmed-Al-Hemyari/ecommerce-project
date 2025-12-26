import { Copy, Edit, Eye, Plus, RefreshCcw, Trash, Trash2, X } from "lucide-react";
import { handleAddStock, handleCancel, hardDelete, restore, softDelete } from "./Functions";
import ActionButton from "@/components/UI/Tables/ActionButton";

import { useNavigate } from "react-router-dom";

export const actionButtons = (id, type, link, navigate, refreshAction) => ({
    'soft-delete': (
      <ActionButton
        Icon={Trash}
        size={18}
        color="#d50101"
        handleClick={() =>
          softDelete(
            [id],
            type,
            null,
            () => refreshAction(`${type} deleted successfully`)
          )
        }
      />
    ),

    'hard-delete': (
      <ActionButton
        Icon={Trash2}
        size={18}
        color="#d50101"
        handleClick={() =>
          hardDelete(
            [id],
            type,
            null,
            () => refreshAction(`${type} deleted permanently successfully`)
          )
        }
      />
    ),

    'restore': (
      <ActionButton
        Icon={RefreshCcw}
        size={18}
        color="#2563EB"
        handleClick={() =>
          restore(
            [id],
            type,
            null,
            () => refreshAction(`${type} restored successfully`)
          )
        }
      />
    ),

    'cancel': (
      <ActionButton
        Icon={X}
        size={18}
        color="#d50101"
        handleClick={() =>
          handleCancel(
            [id],
            null,
            () => refreshAction(`Order cancelled successfully`)
          )
        }
      />
    ),

    'edit': (
      <ActionButton
        Icon={Edit}
        size={18}
        color="#333333"
        handleClick={() => navigate(`${link}/update/${id}`)}
      />
    ),

    'show': (
      <ActionButton
        Icon={Eye}
        size={18}
        color="#333333"
        handleClick={() => navigate(`${link}/show/${id}`)}
      />
    ),

    'ruplicate': (
      <ActionButton
        Icon={Copy}
        size={18}
        color="#333333"
        handleClick={() =>
          navigate(`${link}/create`, {
            state: { id }
          })
        }
      />
    ),

    'add-to-stock': (
      <ActionButton
        Icon={Plus}
        size={18}
        handleClick={() =>
          handleAddStock(
            [id],
            null,
            () => refreshAction(`Added stock successfully`)
          )
        }
      />
    )
  });