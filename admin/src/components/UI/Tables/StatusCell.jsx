import React from 'react'

const StatusCell = ({item, header}) => {
    const statusStyle = {
        Pending:    'bg-gray-100 text-gray-800',
        Processing:'bg-blue-100 text-blue-800',
        Shipped:   'bg-purple-100 text-purple-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

  return (
    <td
        className={`p-3 border-b text-wrap text-center text-base tracking-wider`}
    >
        <div className='flex justify-center'>
            <div className={`${ statusStyle[item[header.field]] } w-fit px-5 rounded-2xl text-center p-1`}>
                {item[header.field]}
            </div>
        </div>
    </td>
  )
}

export default StatusCell