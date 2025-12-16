import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import brandService from '@/services/brandService';
import { enqueueSnackbar } from 'notistack';
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';

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
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState();
  const [description, setDescription] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  
  const getProduct = async (id) => {
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load product', { variant: 'error' });
      console.error(error);
    }
  }

  const getBrands = async () => {
    try {
      const response = await brandService.getBrands();
      setBrands(response.data.brands);
    } catch (error) {
      enqueueSnackbar("Failed to load brands", { variant: 'error' });    
    }
  }

  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      enqueueSnackbar("Failed to load categories", { variant: 'error' });    
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
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
  }, [product]);

  const handleSubmit = async () => {
    setFormError('');

    if (!name || !brand || !category || !price) {
      setFormError('Please fill all fields with * ');
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('description', description);
      if (image) formData.append('file', image); // MUST MATCH multer field name

      const response = await productService.updateProduct(id, formData);
      return true;
    } catch (error) {
      // enqueueSnackbar('Failed to add product');
      return false;
    }
  }

  const resetForm = () => {
    if (!product) return;
    setName(product.name || '');
    setBrand(product.brand?._id);
    setCategory(product.category?._id);
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
      <UpdateForm
        inputs={inputs}
        title={`Update ${product?.name || ''}`}
        link={'/products'}
        formError={formError}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </MainLayout>
  )
}

export default UpdateProduct