import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import brandService from '@/services/brandService';
import { enqueueSnackbar } from 'notistack';
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import Spinner from '@/components/UI/Spinner';

const UpdateProduct = () => {
  // id
  const { id } = useParams();
  // Current product
  const [product, setProduct] = useState([]);
  // data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  // Errors
  const [formError, setFormError] = useState('');
  // fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState();
  const [category, setCategory] = useState();
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState();
  const [description, setDescription] = useState('');
  // Loading
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  const getProduct = async (id) => {
    setLoadingFetch(true);
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load product', { variant: 'error' });
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
      enqueueSnackbar("Failed to load brands", { variant: 'error' });    
    } finally {
      setLoadingFetch(false);
    }
  }

  const getCategories = async () => {
    setLoadingFetch(true);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      enqueueSnackbar("Failed to load categories", { variant: 'error' });    
    } finally {
      setLoadingFetch(false);
    }
  }
  
  useEffect(() => {
    getProduct(id);
    getBrands();
    getCategories();
  }, []);

  useEffect(() => {
    setName(product.name);
    setBrand(product.brand?._id);
    setCategory(product.category?._id);
    setStock(product.stock);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
  }, [product]);

  const handleSubmit = async () => {
    setFormError('');

    setLoadingSubmit(true);

    if (!name || !brand || !category || !price) {
      setFormError('Please fill all fields with * ');
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
      console.log(category);
      if (image) formData.append('file', image); // MUST MATCH multer field name

      const response = await productService.updateProduct(id, formData);
      return true;
    } catch (error) {
      enqueueSnackbar(error || 'Failed to update product');
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  }

  const resetForm = () => {
    if (!product) return;
    setName(product.name || '');
    setBrand(product.brand?._id);
    setCategory(product.category?._id);
    setStock(product.stock);
    setPrice(product.price);
    setDescription(product.description || '');
    setImage(product.image);
    setFormError('');
  };


  const inputs = [
    {
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Type name...', 
      value: name || '', 
      setValue: setName 
    },
    {
      label: 'Brand', 
      important: true, 
      type: 'select', 
      placeholder: 'Select brand...',
      options: brands,
      value: brand || '', 
      setValue: setBrand 
    },
    {
      label: 'Category', 
      important: true, 
      type: 'select', 
      placeholder: 'Select category...',
      options: categories,
      value: category || '', 
      setValue: setCategory 
    },
    {
      label: 'Stock', 
      important: true, 
      type: 'text', 
      placeholder: 'Enter Stock', 
      value: stock || '', 
      setValue: setStock 
    },
    {
      label: 'Price', 
      important: true, 
      type: 'text', 
      placeholder: 'Enter price', 
      value: price || '', 
      setValue: setPrice 
    },
    {
      label: 'Description',
      type: 'textarea', 
      placeholder: 'Type description...', 
      value: description || '', 
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
      {loadingFetch ? <Spinner/> : 
        <UpdateForm
          inputs={inputs}
          title={`Update ${product?.name || ''}`}
          link={'/products'}
          loading={loadingSubmit}
          formError={formError}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      }
    </MainLayout>
  )
}

export default UpdateProduct