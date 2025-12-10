import React, { useEffect, useState } from 'react'
import ActionButton from './ActionButton';
import { Edit, Eye, Plus, Square, SquarePlus, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StringCell from './StringCell';
import BoolCell from './BoolCell';
import StatusCell from './StatusCell';
import PriceCell from './PriceCell';
import LinkCell from './LinkCell';

const DataTable = ({
  tableName = '',
  headers = [], 
  link = '', 
  data = [],
  handleDelete,
}) => {

  const navigate = useNavigate();

  const CellComponents = {
    string: StringCell,
    bool: BoolCell,
    status: StatusCell,
    price: PriceCell,
    link: LinkCell
  }

  const handleCreate = () => {
    navigate(`${link}/create`);
  }

  const handleShow = (id) => {
    navigate(`${link}/show/${id}`);
  }
  
  const handleEdit = (id) => {
    navigate(`${link}/update/${id}`);
  }

  return (
    <div>
      <div className='flex flex-row justify-between mb-5 px-2 py-3'>
        <h1 className='text-3xl font-medium'>{tableName}</h1>
      </div>
      <div className='flex flex-row justify-end mb-4'>      
        <Link to={`${link}/create`} className='bg-(--color-green) text-(--color-dark-gray) text-lg flex flex-row items-center gap-2 font-medium rounded-md px-3 py-1'>
          Create
        </Link>
      </div>
      <div className="overflow-x-auto w-full">

        <table className='table-auto w-full max-h-[calc(100vh-16rem)]'>
          <thead className='w-full border-b'>
            <tr>
              {headers.map((header, index) => (
                <td 
                  key={index} 
                  style={{ width: `${100/ headers.length}%`}}
                  className={`py-1 text-lg font-medium text-black ${(header.type === 'status' || header.type === 'bool' || header.type === 'price') && 'text-center'}`}
                >
                  {header.label}
                </td>
              ))}
              <td 
                style={{ width: `${100/ headers.length}%`}}
                className={`py-1 text-lg text-center font-medium text-black`}
              >
                Actions
              </td>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndx) => {
                    const Cell = CellComponents[header.type];
                    if(!Cell) return null;

                    if (header.type === 'link') {
                      return (
                        <LinkCell
                          key={header.accessor}
                          item={item}
                          colIndx={colIndx}
                          header={header}
                          link={`/${header.link}/show/${item._id}`}
                        />
                      )
                    }

                    return (
                      <Cell
                        key={header.accessor}
                        item={item}
                        colIndx={colIndx}
                        header={header}
                      />
                    )
                    
                    })}
                  <td className=''>
                    <div className="flex flex-row-reverse items-center justify-center">
                      <ActionButton Icon={Trash} size={18} color={'#d50101'} handleClick={() => handleDelete(item._id)}/>
                      <ActionButton Icon={Edit} size={18} color={'#333333'} handleClick={() => handleEdit(item._id)}/>
                      <ActionButton Icon={Eye} size={18} color={'#333333'} handleClick={() => handleShow(item._id)}/>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className='py-4 text-center text-base text-(--color-dark-gray)'>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable


























// // src/components/ui/CustomTable.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Edit, Trash, Eye } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const actionIcons = {
//   edit: Edit,
//   delete: Trash,
//   show: Eye,
// };

// const CustomTable = ({
//   headers = [],
//   types = [],
//   data = [],
//   actions = [],
//   actionHandlers = {},
//   bulkActions = [], // [{ name: "Delete Selected", handler: fn }]
// }) => {
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [allSelected, setAllSelected] = useState(false);

//   useEffect(() => {
//     if (allSelected) {
//       setSelectedRows(data.map((row) => row.id || row._id || row.name)); // use id or name
//     } else {
//       setSelectedRows([]);
//     }
//   }, [allSelected, data]);

//   const toggleRow = (row) => {
//     const id = row.id || row._id || row.name;
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="overflow-x-auto">
//       {/* Bulk Actions */}
//       {bulkActions.length > 0 && selectedRows.length > 0 && (
//         <div className="flex gap-2 mb-2">
//           {bulkActions.map((action) => (
//             <Button
//               key={action.name}
//               variant={action.variant || "outline"}
//               onClick={() =>
//                 action.handler(
//                   data.filter((row) =>
//                     selectedRows.includes(row.id || row._id || row.name)
//                   )
//                 )
//               }
//             >
//               {action.name}
//             </Button>
//           ))}
//         </div>
//       )}

//       <Table>
//         <TableHeader>
//           <TableRow>
//             {/* Checkbox select all */}
//             <TableHead>
//               <input
//                 type="checkbox"
//                 checked={allSelected}
//                 onChange={() => setAllSelected(!allSelected)}
//                 className="cursor-pointer"
//               />
//             </TableHead>

//             {headers.map((header, idx) => (
//               <TableHead key={idx} className='text-base'>{header}</TableHead>
//             ))}
//             {actions.length > 0 && <TableHead className={'text-base'}>Actions</TableHead>}
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={headers.length + 2} className="text-center py-4">
//                 No data available
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((row, idx) => {
//               const rowId = row.id || row._id || row.name;
//               return (
//                 <TableRow key={idx} className={selectedRows.includes(rowId) ? "bg-gray-50" : ""}>
//                   <TableCell>
//                     <input
//                       type="checkbox"
//                       checked={selectedRows.includes(rowId)}
//                       onChange={() => toggleRow(row)}
//                       className="cursor-pointer accent-(--color-green) my-2"
//                     />
//                   </TableCell>

//                   {headers.map((header, i) => {
//                     const key = header.toLowerCase().replace(/\s+/g, "_");
//                     const type = types[i] || "string";
//                     let value = row[key];

//                     if (type === "currency") value = `$${value.toFixed(2)}`;
//                     if (type === "date") value = new Date(value).toLocaleDateString();

//                     return <TableCell key={i} className='text-base'>{value}</TableCell>;
//                   })}

//                   {actions.length > 0 && (
//                     <TableCell>
//                       <div className="flex gap-2">
//                         {actions.map((action) => {
//                           const Icon = actionIcons[action];
//                           if (!Icon) return null;
//                           const classes =
//                             action === "delete"
//                               ? "text-red-500 hover:text-red-600"
//                               : "text-gray-600 hover:text-gray-800";

//                           return (
//                             <button
//                               key={action}
//                               onClick={() => actionHandlers[action]?.(row)}
//                               className={`p-1 ${classes} transition-colors cursor-pointer`}
//                             >
//                               <Icon className="w-4 h-4"/>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               );
//             })
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default CustomTable;
