import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import categoryService from '@/services/categoryService';
import Spinner from '@/components/UI/Spinner';

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  // Loading
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  // Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  // Errors
  const [formError, setFormError] = useState('');

  const getCategory = async () => {
    setLoadingFetch(true);
    try {
      const response = await categoryService.getCategory(id);
      setName(response.data.name);
      setSlug(response.data.slug);
      setCategory(response.data);
    } catch (error) {
      enqueueSnackbar(error || "Failed to update category", { variant: 'error' });
    } finally {
      setLoadingFetch(false);
    }
  }

  useEffect(() => {
    const slugified = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");   // replace spaces with hyphens

    setSlug(slugified);
  }, [name]);

  const inputs = [
    { 
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Category name', 
      value: name, 
      setValue: setName 
    },
    { 
      label: 'Slug', 
      important: true, 
      type: 'text', 
      placeholder: 'Category slug', 
      value: slug, 
      setValue: setSlug 
    },
  ];

  const handleSubmit = async () => {
    setFormError('');
    setLoadingSubmit(true);
    
    if (!name || !slug) {
      setFormError('Please fill all fields with * ');
      return false;
    }

    try {
      const response = await categoryService.updateCategory( id, {
        name: name,
        slug: slug
      });
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  }

  const resetForm = () => {
    getCategory();
    setFormError('');
  }

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <MainLayout>
      { loadingFetch ? <Spinner/> : (
        <UpdateForm
          inputs={inputs}
          title={`Update ${category.name}`}
          link={'/categories'}
          formError={formError}
          loading={loadingSubmit}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}
    </MainLayout>
  )
}

export default UpdateCategory