import React from 'react'
import { Link } from 'react-router-dom'

const ActionButton = ({ Icon, size, tooltip, color, handleClick}) => {
  return (
    <button onClick={handleClick} title={tooltip} className='cursor-pointer mx-2'>
        <Icon size={size} color={color}/>
    </button>
  )
}

export default ActionButton