import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import productService from '@/services/productService'
import { enqueueSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import DataTable from '@/components/UI/Tables/DataTable'
import categoryService from '@/services/categoryService'
import brandService from '@/services/brandService'

const ProductsList = ({ propLimit = 50, inner = false, category, brand }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');
  // Loading
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(propLimit);
  // bulk
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [brandFilter, setBrandFilter] = useState(null);

  const headers = [
    { label: 'Name', field: 'name', type: 'string' },
    { label: 'Category', field: 'category', type: 'link', link: 'categories' },
    { label: 'Brand', field: 'brand', type: 'link', link: 'brands' },
    { label: 'Price', field: 'price', type: 'price' },
  ];

  const getProducts = async (search, category, brand, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(search, category, brand, currentPage, limit);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar("Failed to load products", {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.categories || []);
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
      setBrands(response.data.brands || []);
    } catch (error) {
      enqueueSnackbar("Failed to load brands", {
        variant: 'error'
      });
      console.error(error);
    }
  }
  
  // Bulk Actions functions
  const deleteSeleted = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Delete products',
      text: `Are you sure you want to delete ${selected.length} products?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await productService.deleteMany(selected);
      enqueueSnackbar("Products deleted successfully", { variant: 'success' });
      setSelected([]);
      getProducts(search, categoryFilter, brandFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete products", { variant: 'error' });
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
      getProducts(search, categoryFilter, brandFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete product", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  // Initial useEffect
  useEffect(() => {
    if (category) setCategoryFilter(category);
    if (brand) setBrandFilter(brand);

    getCategories();
    getBrands();
  }, [category, brand]);


  // Filter, pagination useEffect
  useEffect(() => {
    getProducts(search, categoryFilter, brandFilter, currentPage, limit);
  }, [search, categoryFilter, brandFilter, currentPage, limit]);

  // Bulk Actions useEffect
  useEffect(() => {
    if (!bulkAction) return;

    const runBulkAction = async () => {
      if (bulkAction === 'delete') {
        await deleteSeleted();
      }
    };

    runBulkAction();
  }, [bulkAction]);

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

  return inner ? (
     <DataTable
      headers={headers}
      link="/products"
      data={products}
      filters={filters}
      search={search}
      setSearch={setSearch}
      tableName="Products"
      handleDelete={handleDelete}
      loading={loading}
      // Pagination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      limit={limit}
      setLimit={setLimit}
      inner={inner}
    />
  ) : (
      <MainLayout>
        <DataTable
          headers={headers}
          link="/products"
          data={products}
          filters={filters}
          search={search}
          setSearch={setSearch}
          tableName="Products"
          handleDelete={handleDelete}
          loading={loading}
          // Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          setLimit={setLimit}
          // bulk
          selected={selected}
          setSelected={setSelected}
          setBulkAction={setBulkAction}
          bulkActions={[
            { name: 'Delete Selected', _id: 'delete', color: 'red-600'},
          ]}
        />
      </MainLayout>
  );

}

export default ProductsList