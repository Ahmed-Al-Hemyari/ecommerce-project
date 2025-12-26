import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import defaulProductImage from '@/assets/default-product-image.png';
import productService from '@/services/productService';
import OrdersList from '../orders/OrdersList';
import Spinner from '@/components/UI/Spinner';

const ShowProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load product", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  const data = product ? [
    { label: 'Name', value: product.name },
    { label: 'Brand', value: product.brand?.name || '-' },
    { label: 'Category', value: product.category?.name || '-' },
    { label: 'Stock', value: product.stock },
    { label: 'Price', value: `$${product.price}` },
    { label: 'Description', value: product.description || '-' },
  ] : [];

  return (
    <MainLayout>
      {loading ? <Spinner/> : (
        <>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
            title={`${product.name} Details`}
            image={product.image ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${product.image}` : defaulProductImage}
            data={data}
            type={'Product'}
            actions={
              product.deleted ? [
                'edit', 'restore', 'hard-delete' 
              ] : [
                'add-to-stock', 'ruplicate', 'edit', 'soft-delete'
              ]
            }
            deleted={product.deleted}
            link={'/products'}
          />
          <div className='h-15'/>
          <OrdersList propLimit={10} inner product={product}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowProduct

