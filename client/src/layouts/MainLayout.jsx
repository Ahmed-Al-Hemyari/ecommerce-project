import React from 'react'
import Navbar from '../components/Navbar'

const MainLayout = ({page, children}) => {
  return (
    <div>
        <Navbar page={page} />
        <div>
            {children}
        </div>
    </div>
  )
}

export default MainLayout