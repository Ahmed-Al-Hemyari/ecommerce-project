import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/dashboard/Dashboard'

const App = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path='/' element={<Dashboard/>}/>
      {/* Brands */}
      <Route path='/brands' element={<Dashboard/>}/>
      <Route path='/brands/create' element={<Dashboard/>}/>
      <Route path='/brands/update/:id' element={<Dashboard/>}/>
      {/* Categories */}
      {/* Orders */}
      {/* Users */}
    </Routes>
  )
}

export default App