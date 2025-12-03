import React from 'react'

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-current border-t-transparent"></div>
    </div>
  )
}

export default Spinner