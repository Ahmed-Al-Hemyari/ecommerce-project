import React from 'react'

const PriceCell = ({item, header}) => {
  return (
    <td
        className='py-4 text-wrap text-base text-(--color-dark-gray) text-center tracking-wider'
    >
        ${item[header.field]}
    </td>
  )
}

export default PriceCell