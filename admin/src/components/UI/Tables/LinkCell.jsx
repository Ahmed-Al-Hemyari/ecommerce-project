import React from 'react'
import { Link } from 'react-router-dom'

const LinkCell = ({item, header, link}) => {
  return (
    <td
        className='py-4 pr-5 pl-1 text-wrap text-base font-bold text-(--color-dark-green) tracking-wider'
    >
        <Link to={link}>
            {item[header.field]}
        </Link>
    </td>
  )
}

export default LinkCell