import React from 'react'
import { Trash, Edit, SquarePlus  } from 'lucide-react'
import { Link } from 'react-router-dom'

const ActionButton = ({ Icon, size, color, handleClick}) => {
  return (
    <button onClick={handleClick} className='cursor-pointer mx-2'>
        <Icon size={size} color={color}/>
    </button>
  )
}

export default ActionButton