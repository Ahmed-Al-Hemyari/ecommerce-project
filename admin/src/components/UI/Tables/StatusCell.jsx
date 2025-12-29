import React from 'react'

const StatusCell = ({item, header}) => {
    const statusStyle = {
        draft:    'bg-gray-200 text-gray-700',
        pending:    'bg-gray-100 text-gray-800',
        processing:'bg-blue-100 text-blue-800',
        shipped:   'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

  return (
    <td
        className={`p-3 border-b text-wrap text-center text-base tracking-wider`}
    >
        <div className='flex justify-center'>
            <div className={`${ statusStyle[item[header.field]] } w-fit px-5 rounded-2xl text-center p-1`}>
                {item[header.field].charAt(0).toUpperCase() + item[header.field].slice(1)}
            </div>
        </div>
    </td>
  )
}

export default StatusCell