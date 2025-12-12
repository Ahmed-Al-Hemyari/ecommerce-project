import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import productService from '@/services/productService'
import { enqueueSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import DataTable from '@/components/UI/Tables/DataTable'

const ProductsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState([]);

  const headers = [
    { label: 'Title', field: 'title', type: 'string' },
    { label: 'Category', field: 'category', type: 'link', link: 'categories' },
    { label: 'Brand', field: 'brand', type: 'link', link: 'brands' },
    { label: 'Price', field: 'price', type: 'price' },
  ];

  const getProducts = async (search) => {
    try {
      const response = await productService.getProducts(search);
      const formatted = response.data.map(product => ({
        ...product,
        category: product.category.name,
        brand: product.brand.name,
      }));
      setProducts(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load products", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    const result = Swal.fire({
      title: 'Delete Product',
      text: 'Sure you want to delete this product??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await productService.deleteProduct(id);
      enqueueSnackbar("Product deleted successfully", {
        variant: 'success'
      });
      getProducts();
    } catch (error) {
      enqueueSnackbar("Failed to delete product", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    getProducts(search);
  }, [search]);

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
      <DataTable
        headers={headers}
        link='/products'
        data={products}
        search={search}
        setSearch={setSearch}
        tableName='Products Table'
        handleDelete={handleDelete}
      />
    </MainLayout>
  )
}

export default ProductsList