import React from 'react'
import {
    BadgeCheck,
    BadgeX
} from 'lucide-react'

const BoolCell = ({ item, header}) => {
    const value = item[header.field];
  return (
    <td
        className='py-4 text-wrap flex items-center justify-center text-base text-(--color-dark-gray) tracking-wider'
    >
        {value ? <BadgeCheck color='#16A34A'/> : <BadgeX color='#DC2626'/>}
    </td>
  )
}

export default BoolCell