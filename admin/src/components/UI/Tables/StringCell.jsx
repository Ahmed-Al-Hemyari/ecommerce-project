import React from 'react'
import { Link } from 'react-router-dom';

const StringCell = ({link, item, header}) => {
  if(item[header.field] === null || item[header.field] === undefined){
    return (
      <td className="p-3 border-b text-base text-(--color-dark-gray)">
        -
      </td>
    );
  }
      

  return (
    <td
        className='border-b '
    >
      <Link 
        className='block w-full h-full p-3 text-wrap text-base text-(--color-dark-gray) tracking-wider' 
        to={link ? `${link}/show/${item._id}` : null} key={header.field}>
        {item[header.field]}
      </Link>
    </td>
  )
}

export default StringCell