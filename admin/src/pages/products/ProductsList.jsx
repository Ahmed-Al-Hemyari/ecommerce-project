import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import productService from '@/services/productService'
import { enqueueSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomTable from '@/components/CustomTable'

const ProductsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const headers = ['Title', 'Category', 'Brand', 'Price'];
  const types = ['string', 'string', 'string', 'currency'];

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
        types={types}
        data={products}
        actions={['edit', 'show', 'delete']}
      />
    </MainLayout>
  )
}

export default ProductsList