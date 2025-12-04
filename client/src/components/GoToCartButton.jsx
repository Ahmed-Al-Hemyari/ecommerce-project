import React from 'react'
import { AiOutlineArrowRight, AiOutlineImport } from 'react-icons/ai'
import { Link } from 'react-router-dom'


const GoToCartButton = ({name}) => {
  return (
    <Link to={'/cart'}>
      <button
        className="text-lg py-2 px-6 font-bold bg-(--color-green) rounded-full
                  fixed right-5 bottom-5 shadow-lg z-50 cursor-pointer"
      >
        Go to Cart <AiOutlineArrowRight className='inline'/>
      </button>
    </Link>
  )
}

export default GoToCartButton