import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ProtectRoute from './components/ProtectRoute'

import Dashboard from './pages/dashboard/Dashboard'
import CreateBrand from './pages/brands/CreateBrand'
import UpdateBrand from './pages/brands/UpdateBrand'
import BrandsList from './pages/brands/BrandsList'
import CategoryList from './pages/categories/CategoryList'
import CreateCategory from './pages/categories/CreateCategory'
import UpdateCategory from './pages/categories/UpdateCategory'
import OrdersList from './pages/orders/OrdersList'
import CreateOrder from './pages/orders/CreateOrder'
import UpdateOrder from './pages/orders/UpdateOrder'
import UsersList from './pages/users/UsersList'
import CreateUser from './pages/users/CreateUser'
import UpdateUser from './pages/users/UpdateUser'
import ProductsList from './pages/products/ProductsList'
import CreateProduct from './pages/products/CreateProduct'
import UpdateProduct from './pages/products/UpdateProduct'
import Login from './pages/auth/Login'

const App = () => {
  return (
    <Routes>

    {/* Dashboard */}
    <Route
      path="/dashboard"
      element={
        <ProtectRoute>
          <Dashboard />
        </ProtectRoute>
      }
    />

    {/* Auth */}
    <Route
      path="/login"
      element={
          <Login />
      }
    />

    {/* Brands */}
    <Route
      path="/brands"
      element={
        <ProtectRoute>
          <BrandsList />
        </ProtectRoute>
      }
    />

    <Route
      path="/brands/create"
      element={
        <ProtectRoute>
          <CreateBrand />
        </ProtectRoute>
      }
    />

    <Route
      path="/brands/update/:id"
      element={
        <ProtectRoute>
          <UpdateBrand />
        </ProtectRoute>
      }
    />

    {/* Products */}
    <Route
      path="/products"
      element={
        <ProtectRoute>
          <ProductsList />
        </ProtectRoute>
      }
    />

    <Route
      path="/products/create"
      element={
        <ProtectRoute>
          <CreateProduct />
        </ProtectRoute>
      }
    />

    <Route
      path="/products/update/:id"
      element={
        <ProtectRoute>
          <UpdateProduct />
        </ProtectRoute>
      }
    />

    {/* Categories */}
    <Route
      path="/categories"
      element={
        <ProtectRoute>
          <CategoryList />
        </ProtectRoute>
      }
    />

    <Route
      path="/categories/create"
      element={
        <ProtectRoute>
          <CreateCategory />
        </ProtectRoute>
      }
    />

    <Route
      path="/categories/update/:id"
      element={
        <ProtectRoute>
          <UpdateCategory />
        </ProtectRoute>
      }
    />

    {/* Orders */}
    <Route
      path="/orders"
      element={
        <ProtectRoute>
          <OrdersList />
        </ProtectRoute>
      }
    />

    <Route
      path="/orders/create"
      element={
        <ProtectRoute>
          <CreateOrder />
        </ProtectRoute>
      }
    />

    <Route
      path="/orders/update/:id"
      element={
        <ProtectRoute>
          <UpdateOrder />
        </ProtectRoute>
      }
    />

    {/* Users */}
    <Route
      path="/users"
      element={
        <ProtectRoute>
          <UsersList />
        </ProtectRoute>
      }
    />

    <Route
      path="/users/create"
      element={
        <ProtectRoute>
          <CreateUser />
        </ProtectRoute>
      }
    />

    <Route
      path="/users/update/:id"
      element={
        <ProtectRoute>
          <UpdateUser />
        </ProtectRoute>
      }
    />

  </Routes>

  )
}

export default App