import React from 'react'
import { Link } from 'react-router-dom'

const LinkCell = ({item, header, link}) => {
  return (
    <td
        className='p-3 border-b text-wrap text-base font-bold text-(--color-dark-green) tracking-wider'
    >
        <Link to={link}>
            {item[header.field]}
        </Link>
    </td>
  )
}

export default LinkCell