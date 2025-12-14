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
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(50);

  const headers = [
    { label: "Name", field: "name", type: 'string' }
  ];


  const getBrands = async (search, currentPage, limit) => {
    try {
      const response = await brandService.getBrands(search, currentPage, limit);
      setBrands(response.data.brands);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar("Failed to load brands", { variant: 'error' });
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

  useEffect(() => {
    getBrands();
  }, []);

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
        // Pagination
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit} setLimit={setLimit}
      />
    </MainLayout>
  )
}

export default BrandsList