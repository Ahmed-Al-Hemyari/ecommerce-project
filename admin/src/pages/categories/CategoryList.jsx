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

  const headers = [
    { label: 'Name', field: 'name', type: 'string' },
    { label: 'Slug', field: 'slug', type: 'string' },
  ];

  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load categories", { variant: 'error' });
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
      getCategories();
    } catch (error) {
      enqueueSnackbar("Failed to delete category", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

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
        link={'/categories'}
        tableName='Categories Table'
        data={categories}
        handleDelete={handleDelete}
      />
    </MainLayout>
  )
}

export default CategoryList;