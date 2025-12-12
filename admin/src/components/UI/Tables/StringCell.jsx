import React from 'react'

const StringCell = ({item, header}) => {
  return (
    <td
        className='p-3 border-b text-wrap text-base text-(--color-dark-gray) tracking-wider'
    >
        {item[header.field]}
    </td>
  )
}

export default StringCell