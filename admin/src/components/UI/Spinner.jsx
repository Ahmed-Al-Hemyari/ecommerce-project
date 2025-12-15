import React from 'react'

const Spinner = () => {
  return (
    <div className='w-full h-full flex items-center content-center justify-center'>
        <div class="flex-col gap-4 w-full h-full flex items-center justify-center">
            <div class="w-28 h-28 border-8 text-(--color-green) text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-(--color-dark-green) rounded-full">
            </div>
        </div>
    </div>
  )
}

export default Spinner