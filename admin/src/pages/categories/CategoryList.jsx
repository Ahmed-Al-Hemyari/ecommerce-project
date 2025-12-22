import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'
import categoryService from '@/services/categoryService';
import { Button } from '@/components/UI/button';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';
import { hardDelete, restore, softDelete } from '@/utils/Functions';

const CategoryList = () => {
  // Essentials
  const location = useLocation();
  const navigate = useNavigate();
  // Type
  const type = 'Category';
  // Date
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

  const headers = [
    { label: 'Name', field: 'name', type: 'string' },
    { label: 'Slug', field: 'slug', type: 'string' },
  ];

  const bulkActions = 
    deletedFilter
      ? [
          { name: 'Restore selected', _id: 'restore' },
          { name: 'Delete permanently', _id: 'hard-delete', color: 'red' }
        ]
      : [
          { name: 'Delete Selected', _id: 'delete', color: 'red' }
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

  const refreshCategories = () => 
    getCategories(search, deletedFilter, currentPage, limit);

  // Search
  useEffect(() => {
    setLoading(true);
    refreshCategories();
  }, [search, deletedFilter, currentPage, limit]);

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
            refreshCategories
          )
          break;
        case 'restore':
          await restore(
            selected,
            type,
            setSelected,
            refreshCategories
          )
          break;
        case 'hard-delete':
          await hardDelete(
            selected,
            type,
            setSelected,
            refreshCategories
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
    if (!location.state?.message) return;

    enqueueSnackbar(location.state.message, {
      variant: location.state.status,
    });

    navigate(location.pathname, { replace: true });
  }, []);


  return (
    <MainLayout>
      <DataTable
        tableName='Categories'
        type='Category'
        headers={headers}
        link={'/categories'}
        data={categories}
        loading={loading}
        // Pagination
        pagination={{ currentPage, setCurrentPage, totalPages, totalItems, limit, setLimit }}
        filters={{ inputs: filters, search, setSearch}}
        // Refresh
        refreshData={refreshCategories}
        // Actions
        actions={
          deletedFilter ? [
            'hard-delete', 'restore', 'edit', 'show'
          ] : [
            'soft-delete', 'edit', 'show'
          ]
        }
        // bulk
        bulk={{ selected, setSelected, bulkActions, bulkAction, setBulkAction }}
      />
    </MainLayout>
  )
}

export default CategoryList;