import React, { useEffect, useState } from 'react'
import ActionButton from './ActionButton';
import { Edit, Eye, Plus, Search, Square, SquarePlus, Trash } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StringCell from './StringCell';
import BoolCell from './BoolCell';
import StatusCell from './StatusCell';
import PriceCell from './PriceCell';
import LinkCell from './LinkCell';
import Input from '../Forms/Input';
import { enqueueSnackbar } from 'notistack';
import Filters from '../Filters';

const DataTable = ({
  tableName = '',
  headers = [], 
  link = '', 
  data = [],
  filters = [],
  search,
  setSearch,
  handleDelete,
}) => {

  const navigate = useNavigate();
  const location = useLocation();

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
        <h1 className='text-3xl font-medium'>{tableName}</h1>
      </div>
      <div className="overflow-x-auto w-full">

        <section className=' border rounded-2xl overflow-hidden'>
          <table className='table-auto w-full max-h-[calc(100vh-16rem)]'>
            <thead className='w-full border-b-2'>
              <tr>
                <td colSpan={headers.length + 1}>
                  <div className='w-full p-5 border-b flex flex-row items-center justify-between'>
                    <h1 className='text-xl font-bold'>{tableName}</h1>
                    <Link to={`${link}/create`} className='bg-(--color-green) text-(--color-dark-gray) text-lg flex flex-row items-center gap-2 font-medium rounded-md px-3 py-1'>
                      Create
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className='w-full' colSpan={headers.length + 1}>
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
                    {filters.length > 0 && <Filters inputs={filters}/>}
                  </div>
                </td>
              </tr>
              <tr className='bg-gray-50 border-t'>
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
                    <td className='border-b'>
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
        </section>
      </div>
    </div>
  )
}

export default DataTable
