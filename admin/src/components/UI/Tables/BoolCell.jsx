import React from 'react'
import {
    BadgeCheck,
    BadgeX
} from 'lucide-react'

const BoolCell = ({ item, header}) => {
    const value = item[header.field];
  return (
    <td
        className='p-3 border-b text-wrap text-base font-bold text-(--color-dark-green) tracking-wider'
    >
        {value ? <BadgeCheck color='#16A34A' className='m-auto'/> : <BadgeX color='#DC2626' className='m-auto'/>}
    </td>
  )
}

export default BoolCell