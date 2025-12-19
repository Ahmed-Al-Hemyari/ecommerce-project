import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'
import categoryService from '@/services/categoryService';
import { Button } from '@/components/UI/button';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';

const CategoryList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  // Loading
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(50);
  // bulk
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Filters
  const [deletedFilter, setDeletedFilter] = useState(null);

  const headers = [
    { label: 'Name', field: 'name', type: 'string' },
    { label: 'Slug', field: 'slug', type: 'string' },
  ];

  const getCategories = async (search, deleted, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories(search, deleted, currentPage, limit);
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar("Failed to load categories", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  // Bulk Actions functions
  const deleteSeleted = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Delete categories',
      text: `Are you sure you want to delete ${selected.length} categories?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await categoryService.deleteMany(selected);
      enqueueSnackbar("Categories deleted successfully", { variant: 'success' });
      setSelected([]);
      getCategories(search, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete categories", { variant: 'error' });
      console.error(error);
    }
  }

  const hardDeleteMany = async () => {
    setBulkAction('');
    const result = Swal.fire({
      title: 'Delete Category Permenantly',
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
      await categoryService.hardDelete(selected);
      enqueueSnackbar("Category deleted successfully", {
        variant: 'success'
      });
      setSelected([]);
      getCategories(search, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const restoreSeleted = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Restore categories',
      text: `Are you sure you want to restore ${selected.length} categories?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore them',
      confirmButtonColor: '#1d7451',
    });

    if (!result.isConfirmed) return;

    try {
      await categoryService.restoreMany(selected);
      enqueueSnackbar("Categories restored successfully", { variant: 'success' });
      setSelected([]);
      setDeletedFilter(null);
      getCategories(search, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to restore categories", { variant: 'error' });
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    const result = Swal.fire({
      title: 'Delete Category',
      text: 'Sure you want to delete this category??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await categoryService.deleteCategory(id);
      enqueueSnackbar("Category deleted successfully", {
        variant: 'success'
      });
      getCategories(search, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete category", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const handleRestore = async (id) => {
    const result = Swal.fire({
      title: 'Restore Category',
      text: 'Sure you want to restore this category??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it',
      confirmButtonColor: '#1d7451'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await categoryService.restoreCategory(id);
      enqueueSnackbar("Category restored successfully", {
        variant: 'success'
      });
      setDeletedFilter(null);
      getCategories(search, deletedFilter, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to restore category", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  // Search
  useEffect(() => {
    getCategories(search, deletedFilter, currentPage, limit);
  }, [search, deletedFilter, currentPage, limit]);

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
    if (!location.state?.message) return;

    enqueueSnackbar(location.state.message, {
      variant: location.state.status,
    });

    navigate(location.pathname, { replace: true });
  }, []);

  const filters = [
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

  return (
    <MainLayout>
      <DataTable
        headers={headers}
        link={'/categories'}
        tableName='Categories'
        data={categories}
        filters={filters}
        search={search}
        setSearch={setSearch}
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        // Loading
        loading={loading}
        // Pagination
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit} setLimit={setLimit}
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
  )
}

export default CategoryList;