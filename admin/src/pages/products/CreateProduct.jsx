import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import categoryService from '@/services/categoryService'
import { enqueueSnackbar } from 'notistack';
import brandService from '@/services/brandService';
import Dropdown from '@/components/UI/Forms/Dropdown';
import CreateForm from '@/components/UI/Forms/CreateForm';
import productService from '@/services/productService';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '@/components/UI/Spinner';

const CreateProduct = () => {
  // Essentials
  const navigate = useNavigate();
  const location = useLocation();
  // Data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  // Errors
  const [formError, setFormError] = useState('');
  // fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState();
  const [category, setCategory] = useState();
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState();
  // Ruplicate
  const [product, setProduct] = useState();
  // Loading
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const getCategories = async () => {
    setLoadingFetch(true);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      enqueueSnackbar('Failed to load categories');
      console.error(error);
    } finally {
      setLoadingFetch(false);
    }
  }

  const getBrands = async () => {
    setLoadingFetch(true);
    try {
      const response = await brandService.getBrands();
      setBrands(response.data.brands);
    } catch (error) {
      enqueueSnackbar('Failed to load brands');
      console.error(error);
    } finally {
      setLoadingFetch(false);
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

    if (location.state?.id) {
      const id = location.state?.id;
      setLoadingFetch(true);
      const fetchProduct = async () => {        
        try {
          const response = await productService.getProduct(id);
          setProduct(response.data);
        } catch (error) {
          enqueueSnackbar("Failed to load product");
        } finally {
          setLoadingFetch(false);
        }
      }

      fetchProduct();
    }
  }, [location.state]);

  useEffect(() => {
    if(!product) return;

    setName(product.name);
    setBrand(product.brand?._id);
    setCategory(product.category?._id);
    setStock(product.stock);
    setPrice(product.price);
    setDescription(product.description);
  }, [product]);

  const handleSubmit = async () => {
    setFormError('');
    setLoadingSubmit(true);

    if (!name || !brand || !category || !price) {
      setFormError('Please fill all fields with * ');
      return false;
    }

    if (stock < 0) {
      setFormError("Stock can't be lower than 0");
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('stock', stock);
      formData.append('price', price);
      formData.append('description', description);
      if (image) formData.append('file', image); // MUST MATCH multer field name

      const response = await productService.createProduct(formData);
      return true;
    } catch (error) {
      enqueueSnackbar(error || 'Failed to add product', { variant: "error"});
      console.log(error);
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  }
  
    const resetForm = () => {
      setName("");
      setCategory("");
      setBrand("");
      setStock(0);
      setPrice(0);
      setDescription("");
      setImage('');
      setFormError("");
    }

  const inputs = [
    { 
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Product name', 
      value: name, 
      setValue: setName 
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
      label: 'Stock', 
      important: true, 
      type: 'number', 
      placeholder: 'Stock', 
      value: stock, 
      setValue: setStock 
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
      label: 'Description',
      type: 'textarea', 
      placeholder: 'Description', 
      value: description, 
      setValue: setDescription 
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
      {loadingFetch ? <Spinner/> : (
        <CreateForm
          formTitle='Create Product'
          title='Product'
          inputs={inputs}
          link={'/products'}
          loading={loadingSubmit}
          formError={formError}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}
    </MainLayout>
  )
}

export default CreateProduct