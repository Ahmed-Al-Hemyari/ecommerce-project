import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '@/pages/Home'
import Products from '@/pages/Products'
import About from '@/pages/About'
import Cart from '@/pages/Cart'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Checkout from '@/pages/Checkout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Profile from '@/pages/Profile'
import Orders from '@/pages/Orders'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'
import ProductShow from './pages/ProductShow'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/products/:id" element={<ProductShow/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/cart" element={<Cart/>} />
      {/* Auth */}
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
      } />
      <Route path="/profile/edit" element={
        <ProtectedRoute>
          <EditProfile/>
        </ProtectedRoute>
      } />
      <Route path="/profile/change-password" element={
        <ProtectedRoute>
          <ChangePassword/>
        </ProtectedRoute>
      } />
      {/* Orders */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout/>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders/>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App