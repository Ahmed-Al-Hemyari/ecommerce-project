import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import productService from '@/services/productService'
import { enqueueSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomTable from '@/components/DataTable'

const ProductsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const headers = [
    // 'Title', 'Category', 'Brand', 'Price'
    { label: 'Title', field: 'title' },
    { label: 'Category', field: 'category' },
    { label: 'Brand', field: 'brand' },
    { label: 'Price', field: 'price' },
  ];

  const getProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load products", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });

      // Clear state to prevent showing again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <MainLayout>
      <CustomTable
        headers={headers}
        link='/products'
        data={products}
        tableName='Products Table'
      />
    </MainLayout>
  )
}

export default ProductsList