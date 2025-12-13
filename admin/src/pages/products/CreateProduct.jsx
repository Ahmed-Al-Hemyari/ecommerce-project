import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import categoryService from '@/services/categoryService'
import { enqueueSnackbar } from 'notistack';
import brandService from '@/services/brandService';
import Dropdown from '@/components/UI/Forms/Dropdown';
import CreateForm from '@/components/UI/Forms/CreateForm';
import productService from '@/services/productService';

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  // Errors
  const [formError, setFormError] = useState('');
  // fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState();
  const [image, setImage] = useState();
  const [brand, setBrand] = useState();

  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load categories');
      console.error(error);
    }
  }

  const getBrands = async () => {
    try {
      const response = await brandService.getBrands();
      setBrands(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load brands');
      console.error(error);
    }
  }

  useEffect(() => {
    getCategories();
    getBrands();
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

  const handleSubmit = async () => {
      setFormError('');
  
      if (!title || !brand || !category || !price) {
        setFormError('Please fill all fields with * ');
        return false;
      }
  
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description);
        if (image) formData.append('file', image); // MUST MATCH multer field name

        const response = await productService.createProduct(formData);
        return true;
      } catch (error) {
        // enqueueSnackbar('Failed to add product');
        return false;
      }
    }
  
    const resetForm = () => {
      setTitle("");
      setCategory("");
      setBrand("");
      setPrice(0);
      setImage('');
      setFormError("");
    }

  const inputs = [
    { 
      label: 'Title', 
      important: true, 
      type: 'text', 
      placeholder: 'Product name', 
      value: title, 
      setValue: setTitle 
    },
    { 
      label: 'Brand', 
      important: true, 
      type: 'select',
      options: brands,
      placeholder: 'Choose brand', 
      value: brand, 
      setValue: setBrand 
    },
    { 
      label: 'Category', 
      important: true, 
      type: 'select', 
      options: categories,
      placeholder: 'Choose category', 
      value: category, 
      setValue: setCategory 
    },
    { 
      label: 'Price', 
      important: true, 
      type: 'number', 
      placeholder: 'Product price', 
      value: price, 
      setValue: setPrice 
    },
    {
      label: 'Image', 
      type: 'file', 
      placeholder: '', 
      value: image,
      setValue: setImage,
      showPreview: true
    }
  ];

  return (
    <MainLayout>
      <CreateForm
        formTitle='Create Product'
        title='Product'
        inputs={inputs}
        link={'/products'}
        formError={formError}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </MainLayout>
  )
}

export default CreateProduct