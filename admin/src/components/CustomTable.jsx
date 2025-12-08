// src/components/ui/CustomTable.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const actionIcons = {
  edit: Edit,
  delete: Trash,
  show: Eye,
};

const CustomTable = ({
  headers = [],
  types = [],
  data = [],
  actions = [],
  actionHandlers = {},
  bulkActions = [], // [{ name: "Delete Selected", handler: fn }]
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    if (allSelected) {
      setSelectedRows(data.map((row) => row.id || row._id || row.name)); // use id or name
    } else {
      setSelectedRows([]);
    }
  }, [allSelected, data]);

  const toggleRow = (row) => {
    const id = row.id || row._id || row.name;
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {bulkActions.length > 0 && selectedRows.length > 0 && (
        <div className="flex gap-2 mb-2">
          {bulkActions.map((action) => (
            <Button
              key={action.name}
              variant={action.variant || "outline"}
              onClick={() =>
                action.handler(
                  data.filter((row) =>
                    selectedRows.includes(row.id || row._id || row.name)
                  )
                )
              }
            >
              {action.name}
            </Button>
          ))}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {/* Checkbox select all */}
            <TableHead>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => setAllSelected(!allSelected)}
                className="cursor-pointer"
              />
            </TableHead>

            {headers.map((header, idx) => (
              <TableHead key={idx} className='text-base'>{header}</TableHead>
            ))}
            {actions.length > 0 && <TableHead className={'text-base'}>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length + 2} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => {
              const rowId = row.id || row._id || row.name;
              return (
                <TableRow key={idx} className={selectedRows.includes(rowId) ? "bg-gray-50" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowId)}
                      onChange={() => toggleRow(row)}
                      className="cursor-pointer accent-(--color-green) my-2"
                    />
                  </TableCell>

                  {headers.map((header, i) => {
                    const key = header.toLowerCase().replace(/\s+/g, "_");
                    const type = types[i] || "string";
                    let value = row[key];

                    if (type === "currency") value = `$${value.toFixed(2)}`;
                    if (type === "date") value = new Date(value).toLocaleDateString();

                    return <TableCell key={i} className='text-base'>{value}</TableCell>;
                  })}

                  {actions.length > 0 && (
                    <TableCell>
                      <div className="flex gap-2">
                        {actions.map((action) => {
                          const Icon = actionIcons[action];
                          if (!Icon) return null;
                          const classes =
                            action === "delete"
                              ? "text-red-500 hover:text-red-600"
                              : "text-gray-600 hover:text-gray-800";

                          return (
                            <button
                              key={action}
                              onClick={() => actionHandlers[action]?.(row)}
                              className={`p-1 ${classes} transition-colors cursor-pointer`}
                            >
                              <Icon className="w-4 h-4"/>
                            </button>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
