import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import CreateForm from '@/components/UI/Forms/CreateForm'
import categoryService from '@/services/categoryService';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '@/components/UI/Spinner';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formError, setFormError] = useState('');
  // Loading
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  // Ruplicate
  const [category, setCategory] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  // State listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });

      // Clear state to prevent showing again
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (location.state?.id) {

      setLoadingFetch(true);
      const id = location.state?.id;

      const fetchCategory = async () => {        
        try {
          const response = await categoryService.getCategory(id);
          setCategory(response.data);
        } catch (error) {
          enqueueSnackbar("Failed to load category");
        } finally {
          setLoadingFetch(false);
        }
      }
      
      fetchCategory();
    }
  }, [location.state]);
  
  useEffect(() => {
    if(!category) return;
    
    setName(category.name);
    setSlug(category.slug);
  }, [category]);

  useEffect(() => {
    const slugified = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");   // replace spaces with hyphens

    setSlug(slugified);
  }, [name]);

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setFormError('');

    if (!name) {
      setFormError('Please fill all fields with * ');
      return false;
    }

    try {
      const response = await categoryService.createCategory({
        name: name,
        slug: slug
      });
      return true;
    } catch (error) {
      enqueueSnackbar(error || 'Failed to add category');
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  }

  const resetForm = () => {
    setName("");
    setSlug("");
    setFormError("");
  }

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
      type: 'text', 
      placeholder: 'Category slug', 
      value: slug,
      setValue: setSlug,
      disabled: true,
      readOnly: true,
    }
  ]
  return (
    <MainLayout>
      { loadingFetch ? <Spinner/> : (
        <CreateForm
          title='Create Category'
          inputs={inputs}
          link={'/categories'}
          loading={loadingSubmit}
          formError={formError}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}
    </MainLayout>
  )
}

export default CreateCategory