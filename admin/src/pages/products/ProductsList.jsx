import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import productService from '@/services/productService'
import { enqueueSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import DataTable from '@/components/UI/Tables/DataTable'
import categoryService from '@/services/categoryService'
import brandService from '@/services/brandService'
import { handleAddStock, hardDelete, restore, softDelete } from '@/utils/Functions'

const ProductsList = ({ propLimit = 50, inner = false, category, brand }) => {
  // Essentials
  const location = useLocation();
  const navigate = useNavigate();
  // Type
  const type = 'Product';
  // Data
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
      enqueueSnackbar(error || "Failed to load products", {
        variant: 'error'
      });
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const refreshProducts = () =>
    getProducts(search, categoryFilter, brandFilter, stockFilter, deletedFilter, currentPage, limit);

  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      enqueueSnackbar(error || "Failed to load categories", {
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
      enqueueSnackbar(error || "Failed to load brands", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const handleSoftDelete = async (id) => {
    await softDelete(
      [id],
      type,
      setSelected,
      refreshProducts
    );
  }
  const handleRestore = async (id) => {
    await restore(
      [id],
      type,
      setSelected,
      refreshProducts
    );
  }
  const handleHardDelete = async (id) => {
    await hardDelete(
      [id],
      type,
      setSelected,
      refreshProducts
    );
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
    setLoading(true);
    refreshProducts();
  }, [search, categoryFilter, brandFilter, deletedFilter, stockFilter, currentPage, limit]);

  // Bulk Actions useEffect
  useEffect(() => {
    if (!bulkAction) return;
    
    const runBulkAction = async () => {
      switch (bulkAction) {
        case 'delete':
          await softDelete(
            selected,
            type,
            setSelected,
            refreshProducts
          )
          break;
        case 'restore':
          await restore(
            selected,
            type,
            setSelected,
            refreshProducts
          )
          break;
        case 'hard-delete':
          await hardDelete(
            selected,
            type,
            setSelected,
            refreshProducts
          )
          break;
        default:
          break;
      }
      setBulkAction('');
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


  return inner ? (
     <DataTable
      headers={headers}
      link="/products"
      data={products}
      filters={filters}
      search={search}
      setSearch={setSearch}
      tableName="Products"
      handleAddStock={async (id) => {
        await handleAddStock(id);
        refreshProducts();
      }}
      handleDelete={handleSoftDelete}
      handleRestore={handleRestore}
      hardDelete={handleHardDelete}
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
          handleAddStock={async (id) => {
            await handleAddStock(id);
            refreshProducts();
          }}
          handleDelete={handleSoftDelete}
          handleRestore={handleRestore}
          hardDelete={handleHardDelete}
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