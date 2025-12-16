import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import categoryService from '@/services/categoryService';

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  // Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  // Errors
  const [formError, setFormError] = useState('');

  const getCategory = async () => {
    try {
      const response = await categoryService.getCategory(id);
      setName(response.data.name);
      setSlug(response.data.slug);
      setCategory(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load category", { variant: 'error' });
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
      <UpdateForm
        inputs={inputs}
        title={`Update ${category.name}`}
        link={'/categories'}
        formError={formError}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </MainLayout>
  )
}

export default UpdateCategory