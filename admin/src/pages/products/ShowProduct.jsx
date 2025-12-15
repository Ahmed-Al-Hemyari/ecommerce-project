import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productService from '@/services/productService';

const ShowProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);

  const getProduct = async () => {
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load product", { variant: 'error' });
    }
  }

  const edit = () => {
    navigate(`/products/update/${product._id}`);
  }

  useEffect(() => {
    getProduct();
  }, []);

  const data = product ? [
    { label: 'Name', value: product.name },
    { label: 'Brand', value: product.brand?.name || '-' },
    { label: 'Category', value: product.category?.name || '-' },
    { label: 'Price', value: `$${product.price}` },
    { label: 'Description', value: product.description || '-' },
  ] : [];


  return (
    <MainLayout>
      {product && (
        <ShowCard
          title={`${product.name} Details`}
          image={product.image ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${product.image}` : null}
          data={data}
          onEdit={() => navigate(`/products/update/${product._id}`)}
          backTo={'/products'}
        />
      )}
    </MainLayout>
  );
}

export default ShowProduct