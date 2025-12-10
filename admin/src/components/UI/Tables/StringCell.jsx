import React from 'react'

const StringCell = ({item, header}) => {
  return (
    <td
        className='py-4 pr-5 pl-1 text-wrap text-base text-(--color-dark-gray) tracking-wider'
    >
        {item[header.field]}
    </td>
  )
}

export default StringCell