import React from 'react'

const Spinner = () => {
  return (
    <div className='w-full h-full my-15 flex items-center content-center justify-center'>
        <div className="flex-col gap-4 w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 border-6 text-(--color-green) text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-(--color-dark-green) rounded-full">
            </div>
        </div>
    </div>
  )
}

export default Spinner