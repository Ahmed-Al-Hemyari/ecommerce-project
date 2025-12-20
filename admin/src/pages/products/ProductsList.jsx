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
  const [stockFilter, setStockFilter] = useState(null);
  const [deletedFilter, setDeletedFilter] = useState(null);

  const headers = [
    { label: 'Name', field: 'name', type: 'string' },
    { label: 'Category', field: 'category', type: 'link', link: 'categories' },
    { label: 'Brand', field: 'brand', type: 'link', link: 'brands' },
    { label: 'Stock', field: 'stock', type: 'string' },
    { label: 'Price', field: 'price', type: 'price' },
  ];

  const getProducts = async (search, category, brand, stock, deleted, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(search, category, brand, stock, deleted, currentPage, limit);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar("Failed to load products", {
        variant: 'error'
      });
      console.error(error)
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
      getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete products", { variant: 'error' });
      console.error(error);
    }
  }

  const restoreSeleted = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Restore products',
      text: `Are you sure you want to restore ${selected.length} products?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore them',
      confirmButtonColor: '#1d7451',
    });

    if (!result.isConfirmed) return;

    try {
      await productService.restoreMany(selected);
      enqueueSnackbar("Products restored successfully", { variant: 'success' });
      setSelected([]);
      setDeletedFilter(null);
      getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to restore products", { variant: 'error' });
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
      getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete product", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const handleAddStock = async (id) => {
    const result = Swal.fire({
      title: 'Add Stock',
      text: 'Enter the value to add...',
      icon: 'question',
      input: 'number',
      inputPlaceholder: 'Type...',
      showCancelButton: true,
      confirmButtonColor: '#1d7451',
      confirmButtonText: 'Add',
    })

    if (!(await result).value) {
      return;
    }

    
    const stock = (await result).value;
    console.log(stock);

    try {
      const response = await productService.addStock(id, Number(stock));
      enqueueSnackbar(response.data, {
        variant: 'success'
      });
      getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const hardDeleteMany = async () => {
    setBulkAction('');
    const result = Swal.fire({
      title: 'Delete Product Permenantly',
      text: 'Sure you want to delete this product permenantly??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      await productService.hardDelete(selected);
      enqueueSnackbar("Product deleted successfully", {
        variant: 'success'
      });
      setSelected([]);
      getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const handleRestore = async (id) => {
    const result = Swal.fire({
      title: 'Restore Product',
      text: 'Sure you want to restore this product??',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it',
      confirmButtonColor: '#1d7451'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await productService.restoreProduct(id);
      enqueueSnackbar("Product restored successfully", {
        variant: 'success'
      });
      setDeletedFilter(null);
      getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to restore product", {
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
    getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);
  }, [search, categoryFilter, brandFilter, deletedFilter, stockFilter, currentPage, limit]);

  // Bulk Actions useEffect
  useEffect(() => {
    if (!bulkAction) return;

    const runBulkAction = async () => {
      if (bulkAction === 'delete') {
        await deleteSeleted();
      }
      if (bulkAction === 'restore') {
        await restoreSeleted();
      }
      if (bulkAction === 'hard-delete') {
        await hardDeleteMany();
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
    },
    {
      label: 'Stock',
      options: [
        { _id: 'in-stock', name: 'In Stock' },
        { _id: 'low-stock', name: 'Low Stock' },
        { _id: 'out-of-stock', name: 'Out of Stock' },
      ],
      placeholder: 'Choose Brand',
      value: stockFilter,
      setValue: setStockFilter,
    },
    {
      label: 'Deleted',
      options: [
        { _id: true, name: 'Deleted' },
      ],
      placeholder: 'Choose...',
      value: deletedFilter,
      setValue: setDeletedFilter,
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
      handleAddStock={handleAddStock}
      handleRestore={handleRestore}
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
          handleAddStock={handleAddStock}
          handleRestore={handleRestore}
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
          bulkActions={
            deletedFilter
              ? [
                  { name: 'Restore selected', _id: 'restore' },
                  { name: 'Delete permanently', _id: 'hard-delete', color: 'red' }
                ]
              : [
                  { name: 'Delete Selected', _id: 'delete', color: 'red' }
                ]
          }
        />
      </MainLayout>
  );

}

export default ProductsList