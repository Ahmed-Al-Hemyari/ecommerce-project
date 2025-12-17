import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import brandService from '@/services/brandService';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';

const BrandsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const headers = [
    { label: "Name", field: "name", type: 'string' }
  ];


  const getBrands = async (search, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await brandService.getBrands(search, currentPage, limit);
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

  // Bulk Actions functions
  const deleteSeleted = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Delete brands',
      text: `Are you sure you want to delete ${selected.length} brands?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await brandService.deleteMany(selected);
      enqueueSnackbar("Brands deleted successfully", { variant: 'success' });
      setSelected([]);
      getBrands(search, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete brands", { variant: 'error' });
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const result = Swal.fire({
        title: 'Delete Brand',
        text: 'Sure you want to delete this brand??',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d50101'
      })

      if (!(await result).isConfirmed) {
        return;
      }

      const response = await brandService.deleteBrand(id);
      enqueueSnackbar("Brand deleted successfully", {
        variant: 'success'
      });
      getBrands();
    } catch (error) {
      enqueueSnackbar("Failed to delete brand", {
        variant: 'error'
      });
      console.error(error);
    }
  }

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

  useEffect(() => {
    getBrands(search, currentPage, limit);
  }, [search, currentPage, limit]);

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
        link='/brands'
        data={brands}
        search={search}
        setSearch={setSearch}
        tableName='Brands'
        handleDelete={handleDelete}
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
        bulkActions={[
          { name: 'Delete Selected', _id: 'delete', color: 'red-600'},
        ]}
      />
    </MainLayout>
  )
}

export default BrandsList