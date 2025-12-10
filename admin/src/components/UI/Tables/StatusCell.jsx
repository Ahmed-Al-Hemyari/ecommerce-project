import React from 'react'

const StatusCell = ({item, header}) => {
    const statusStyle = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Processing: 'bg-yellow-100 text-yellow-800',
        Shipped: 'bg-yellow-100 text-yellow-800',
        Delivered: 'bg-yellow-100 text-yellow-800',
    }
  return (
    <td
        className={`py-4 text-wrap text-base tracking-wider`}
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