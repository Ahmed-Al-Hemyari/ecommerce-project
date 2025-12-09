import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'
import categoryService from '@/services/categoryService';
import { Button } from '@/components/UI/button';
import DataTable from '@/components/DataTable';

const CategoryList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const headers = [
    { label: 'Name', field: 'name'},
    { label: 'Slug', field: 'slug'},
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
      />
    </MainLayout>
  )
}

export default CategoryList;