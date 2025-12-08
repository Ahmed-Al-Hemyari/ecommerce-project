import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'
import categoryService from '@/services/categoryService';
import CustomTable from '@/components/CustomTable';
import { Button } from '@/components/UI/button';

const CategoryList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const handleEdit = (row) => alert("Edit " + row.name);
  const handleDelete = (row) => alert("Delete " + row.name);

  const headers = ['Name', 'Slug'];
  const types = ['string', 'string'];

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
      <CustomTable
        headers={headers}
        types={types}
        data={categories}
        actions={['edit', 'show', 'delete']}
      />
    </MainLayout>
  )
}

export default CategoryList;