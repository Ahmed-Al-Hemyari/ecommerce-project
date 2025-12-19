import React, { useEffect, useState } from 'react'
import ActionButton from './ActionButton';
import { Edit, Eye, Plus, RefreshCcw, Search, Square, SquarePlus, Trash, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StringCell from './StringCell';
import BoolCell from './BoolCell';
import StatusCell from './StatusCell';
import PriceCell from './PriceCell';
import LinkCell from './LinkCell';
import { enqueueSnackbar } from 'notistack';
import Filters from '../Filters';
import Pagination from './Pagination';
import Spinner from '../Spinner';
import Checkbox from '../Checkbox';
import Dropdown from '../Forms/Dropdown';

const DataTable = ({
  tableName = '',
  headers = [], 
  link = '', 
  data = [],
  filters = [],
  search,
  setSearch,
  handleDelete,
  handleRestore,
  handleCancel,
  handleAddStock,
  loading = true,
  // Pagination
  currentPage, setCurrentPage,
  totalPages, 
  totalItems,
  limit, setLimit,
  // Customize
  inner = false,
  // bulk
  selected=[], setSelected,
  bulkActions = [],
  bulkAction, setBulkAction,
}) => {
  // Essentails
  const navigate = useNavigate();
  const location = useLocation();
  // Cell Components
  const CellComponents = {
    string: StringCell,
    bool: BoolCell,
    status: StatusCell,
    price: PriceCell,
    link: LinkCell
  }

  // Handlers
  const handleCreate = () => {
    navigate(`${link}/create`);
  }

  const handleShow = (id) => {
    navigate(`${link}/show/${id}`);
  }
  
  const handleEdit = (id) => {
    navigate(`${link}/update/${id}`);
  }

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };


  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });

      // Clear state to prevent showing again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <div>
      <div className='flex flex-row justify-between mb-5 px-2 py-3'>
        <h1 className={`text-3xl w-full ${inner ? 'text-center font-bold' : 'font-medium'}`}>{tableName}</h1>
      </div>
      <div className=" w-full">

        <section className='border rounded-2xl'>
          <table className='table-auto w-full max-h-[calc(100vh-16rem)]'>
            <thead className='w-full border-b-2'>
              {
                selected.length > 0
                  ? (
                    <tr className='border-b p-2'>
                      <td colSpan={headers.length + 2} className='p-3'>
                        <div className="flex flex-row justify-end">
                          <Dropdown
                            placeholder={'Bulk Actions'}
                            options={bulkActions}
                            setValue={setBulkAction}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                  : ''
              }
              <tr>
                <td colSpan={headers.length + 2}>
                  <div className={`w-full p-5 border-b flex flex-row items-center ${inner ? 'justify-between' : 'justify-end'}`}>
                    {inner && <h1 className={`text-xl font-bold`}>{tableName}</h1>}
                    <Link to={`${link}/create`} className='bg-(--color-green) text-(--color-dark-gray) text-lg flex flex-row items-center gap-2 font-medium rounded-md px-3 py-1'>
                      Create
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className='w-full' colSpan={headers.length + 2}>
                  <div className='w-full h-full p-2 flex flex-row items-center space-x-5 justify-end'>
                    <div className='flex flex-row items-center space-x-2 bg-gray-100 py-2 px-3 rounded-full'>
                      <Search size={18} color='#bfbfbf'/>  
                      <input
                        placeholder="Search..."
                        type="text"
                        name="text"
                        className="focus:outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {(filters.length && !inner) > 0 && <Filters inputs={filters}/>}
                  </div>
                </td>
              </tr>
              <tr className='bg-gray-50 border-t'>
                {
                  inner ? '' : (
                    <td className='px-2'>
                      <Checkbox 
                        checked={
                          data.length > 0 &&
                          data.every(item => selected.includes(item._id))
                        } 
                        onChange={() => {
                          const ids = data.map(item => item._id);

                          const allSelected = ids.every(id => selected.includes(id));

                          setSelected(prev =>
                            allSelected
                              ? prev.filter(id => !ids.includes(id)) // unselect only this page
                              : [...new Set([...prev, ...ids])]     // add this page
                          );
                        }}
                      />
                    </td>
                  )
                }
                {headers.map((header, index) => (
                  <td 
                    key={index} 
                    style={{ width: `${100/ headers.length}%`}}
                    className={`p-3 text-lg font-bold text-black ${(header.type === 'status' || header.type === 'bool') && 'text-center'}`}
                  >
                    {header.label}
                  </td>
                ))}
                <td 
                  style={{ width: `${100/ headers.length}%`}}
                  className={`p-3 text-lg text-center font-bold text-black`}
                >
                  Actions
                </td>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="h-64 text-center"
                  >
                    <div className="flex items-center justify-center h-full">
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {
                      inner ? '' : (
                        <td className='px-2'>
                          <Checkbox 
                            checked={selected.includes(item._id)}
                            onChange={() => toggleSelect(item._id)}
                          />
                        </td>
                      )
                    }
                    {headers.map((header, colIndx) => {
                      const Cell = CellComponents[header.type];
                      if (!Cell) return null;

                      if (header.type === 'link') {
                        return (
                          <LinkCell
                            key={header.field}
                            item={item}
                            header={header}
                          />
                        );
                      }

                      return (
                        <Cell
                          key={header.field}
                          item={item}
                          colIndx={colIndx}
                          header={header}
                        />
                      );
                    })}
                    <td className="border-b">
                      <div className="flex flex-row-reverse items-center justify-center">
                        {(link !== '/orders' && !item.deleted) && (
                          <ActionButton Icon={Trash} size={18} color="#d50101" handleClick={() => handleDelete(item._id)} />
                        )}
                        {item.deleted && (
                          <ActionButton Icon={RefreshCcw} size={18} color="#2563EB" handleClick={() => handleRestore(item._id)} />
                        )}
                        {link === '/orders' && (
                          <ActionButton Icon={X} size={18} color="#d50101" handleClick={() => handleCancel(item._id)} />
                        )}
                        <ActionButton Icon={Edit} size={18} color="#333333" handleClick={() => handleEdit(item._id)} />
                        <ActionButton Icon={Eye} size={18} color="#333333" handleClick={() => handleShow(item._id)} />
                        {handleAddStock && (
                          <ActionButton Icon={Plus} size={18} handleClick={() => handleAddStock(item._id)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="py-6 text-center text-base text-(--color-dark-gray)"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
            {
              inner ? '' : 
                (    
                  <tfoot>
                    <tr>
                      <td colSpan={headers.length + 2}>
                        <div className='flex flex-row justify-center pb-2'>
                          <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            limit={limit}
                            setLimit={setLimit}
                          />
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )
            }
          </table>
        </section>
      </div>
    </div>
  )
}

export default DataTable
