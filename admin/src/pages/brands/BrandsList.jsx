import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import brandService from '@/services/brandService';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';
import { hardDelete, restore, softDelete } from '@/utils/Functions';

const BrandsList = () => {
  // Essentails
  const location = useLocation();
  const navigate = useNavigate();
  // Type
  const type = 'Brand';
  // Data
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState([]);
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
    { label: "Name", field: "name", type: 'string' }
  ];

  const bulkActions = deletedFilter
    ? [
        { name: 'Restore selected', _id: 'restore' },
        { name: 'Delete permanently', _id: 'hard-delete', color: 'red' }
      ]
    : [
        { name: 'Delete Selected', _id: 'delete', color: 'red' }
      ];


  const getBrands = async (search, deleted, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await brandService.getBrands(search, deleted, currentPage, limit);
      setBrands(response.data.brands);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar("Failed to load brands", { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  const refreshBrands = () => 
    getBrands(search, deletedFilter, currentPage, limit);  

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
            refreshBrands
          )
          break;
        case 'restore':
          await restore(
            selected,
            type,
            setSelected,
            refreshBrands
          )
          break;
        case 'hard-delete':
          await hardDelete(
            selected,
            type,
            setSelected,
            refreshBrands
          )
          break;
        default:
          break;
      }

      setBulkAction('');
    };

    runBulkAction();
  }, [bulkAction]);

  useEffect(() => {
    setLoading(true);
    refreshBrands();
  }, [search, deletedFilter, currentPage, limit]);

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
        tableName='Brands'
        type='Brand'
        headers={headers}
        link={'/brands'}
        data={brands}
        loading={loading}
        // Pagination
        pagination={{ currentPage, setCurrentPage, totalPages, totalItems, limit, setLimit }}
        filters={{ inputs: filters, search, setSearch}}
        // Refresh
        refreshData={refreshBrands}
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

export default BrandsList