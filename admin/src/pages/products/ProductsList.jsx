import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import productService from '@/services/productService'
import { enqueueSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import DataTable from '@/components/UI/Tables/DataTable'
import categoryService from '@/services/categoryService'
import brandService from '@/services/brandService'

const ProductsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState([]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [brandFilter, setBrandFilter] = useState(null);

  const headers = [
    { label: 'Title', field: 'title', type: 'string' },
    { label: 'Category', field: 'category', type: 'link', link: 'categories' },
    { label: 'Brand', field: 'brand', type: 'link', link: 'brands' },
    { label: 'Price', field: 'price', type: 'price' },
  ];

  const getProducts = async (search, category, brand) => {
    try {
      const filters = {};

      if (search) filters.search = search;
      if (category) filters.category = category;
      if (brand) filters.brand = brand;

      const response = await productService.getProducts(filters);
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

  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load categories", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const getBrands = async () => {
    try {
      const response = await brandService.getBrands();
      setBrands(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load brands", {
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
    getCategories();
    getBrands();
  }, []);

  useEffect(() => {
    getProducts(search, categoryFilter, brandFilter);
  }, [search, categoryFilter, brandFilter]);

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

  const filters = [
    {
      label: 'Category',
      options: categories,
      placeholder: 'Choose Categories',
      value: categoryFilter,
      setValue: setCategoryFilter,
    },
    {
      label: 'Brand',
      options: brands,
      placeholder: 'Choose Brand',
      value: brandFilter,
      setValue: setBrandFilter,
    }
  ];

  return (
    <MainLayout>
      <DataTable
        headers={headers}
        link='/products'
        data={products}
        filters={filters}
        search={search}
        setSearch={setSearch}
        tableName='Products'
        handleDelete={handleDelete}
      />
    </MainLayout>
  )
}

export default ProductsList