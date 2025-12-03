import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '@/components/Footer'

const MainLayout = ({page, children}) => {
  return (
    <div>
        <Navbar page={page} />
        <div className='bg-gray-50 text-gray-800 min-h-[calc(100vh-5rem)]'>
            {children}
        </div>
        <Footer/>
    </div>
  )
}

export default MainLayout