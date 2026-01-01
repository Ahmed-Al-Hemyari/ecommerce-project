import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StringCell from './StringCell';
import BoolCell from './BoolCell';
import StatusCell from './StatusCell';
import PriceCell from './PriceCell';
import LinkCell from './LinkCell';
import Filters from '../Filters';
import Pagination from './Pagination';
import Spinner from '../Spinner';
import Checkbox from '../Checkbox';
import Dropdown from '../Forms/Dropdown';
import { actionButtons } from '@/utils/actionButtonsMap';

const DataTable = ({
  tableName = '',
  type = '',
  headers = [], 
  link = '', 
  createLink,
  data = [],
  loading = true,
  // Pagination
  pagination = {},
  filters = {},
  // Refresh
  refreshData,
  // Actions
  actions = [],
  // Customize
  customize = {},
  // bulk
  bulk = {},
}) => {
  // Essentails
  const navigate = useNavigate();
  const location = useLocation();
  // Props
  const { currentPage, setCurrentPage, totalPages, totalItems, limit, setLimit } = pagination;
  const { inputs = [], search = '', setSearch = () => {} } = filters;
  const { 
    showHeader = true, 
    showPagination = true, 
    showActions = true, 
    showTableName = false, 
    showSearch = true, 
    showFilters = true, 
    showSelect = true 
  } = customize;
  const {
    selected = [],
    setSelected = () => {},
    bulkActions = [],
    bulkAction,
    setBulkAction = () => {}
  } = bulk;

  // Cell Components
  const CellComponents = {
    string: StringCell,
    bool: BoolCell,
    status: StatusCell,
    price: PriceCell,
    link: LinkCell
  }

  // Handlers
  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <div className='flex flex-row justify-between mb-5 px-2 py-3'>
        <h1 className={`text-3xl w-full ${showTableName ? 'text-center font-bold' : 'font-medium'}`}>{tableName}</h1>
      </div>
      <div className=" w-full">

        <section className='border rounded-2xl overflow-x-scroll'>
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
              {
                showHeader ? (
                  <>
                    <tr>
                      <td colSpan={headers.length + 2}>
                        <div className={`w-full p-5 border-b flex flex-row items-center ${showTableName ? 'justify-between' : 'justify-end'}`}>
                          {showTableName && <h1 className={`text-xl font-bold`}>{tableName}</h1>}
                          <Link 
                            to={createLink ?? `${link}/create`} 
                            className='bg-(--color-green) text-(--color-dark-gray) text-lg flex flex-row items-center gap-2 font-medium rounded-md px-3 py-1'
                          >
                            Create
                          </Link>
                        </div>
                      </td>
                    </tr>
                    { ((showSearch || (inputs.length && showFilters) > 0)) && (
                      <tr>
                        <td className='w-full' colSpan={headers.length + 2}>
                          <div className='w-full h-full p-2 flex flex-row items-center space-x-5 justify-end'>
                            {showSearch && (
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
                            )}
                            {(inputs.length && showFilters) > 0 && <Filters inputs={inputs}/>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ) : 
                (
                  ''
                )
              }
              <tr className='bg-gray-50 border-t'>
                {
                  showSelect && (
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
                {
                  showActions ? (
                    <td 
                      style={{ width: `${100/ headers.length}%`}}
                      className={`p-3 text-lg text-center font-bold text-black`}
                    >
                      Actions
                    </td>
                  ) : ''
                }
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
                      showSelect && (
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

                      return (
                        <Cell
                          key={header.field}
                          link={actions.some(action => ['show'].includes(action)) ? link : null}
                          item={item}
                          colIndx={colIndx}
                          header={header}
                        />
                      );
                    })}
                    {
                      showActions && (
                        <td className="border-b">
                          <div className="flex flex-row-reverse items-center justify-center">
                            {(() => {
                              const buttons = actionButtons(item._id, type, link, navigate, refreshData);
                              return actions.map(action => buttons[action] ?? null);
                            })()}
                          </div>
                        </td>
                      )
                    }
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
              showPagination &&
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
