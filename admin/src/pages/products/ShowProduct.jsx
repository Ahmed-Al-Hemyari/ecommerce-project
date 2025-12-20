import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import productService from '@/services/productService';
import OrdersList from '../orders/OrdersList';

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

  const onAction = async () => {
    const deleted = product.deleted;
    try {
      const result = await Swal.fire({
        title: `${deleted ? 'Restore Product' : 'Delete Product'}`,
        text: `Sure you want to ${deleted ? 'restore' : 'delete'} this product??`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${deleted ? 'restore' : 'delete'} it`,
        confirmButtonColor: `${deleted ? '#1d7451' : '#d50101'}`
      });

      if (!result.isConfirmed) return;
      
      if (deleted) {
        const response = await productService.restoreProduct([id]);
        navigate('/products', {
          state: {
            message: "Product restored successfully",
            status: 'success'
          }
        })
      } else {
        const response = await productService.deleteProduct([id]);
        navigate('/products', {
          state: {
            message: "Product deleted successfully",
            status: 'success'
          }
        })
        
      }
    } catch (error) {
      enqueueSnackbar(`Failed to ${deleted ? 'restore' : 'delete'} product`);
    }
  }

  const onHardDelete = async () => {
    const result = Swal.fire({
      title: 'Delete Product Permenantly',
      text: 'Sure you want to delete this product permenantly??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await productService.hardDelete([id]);
      enqueueSnackbar(response.data, {
        variant: 'success'
      });
      navigate('/products', {
        state: {
          message: "Product deleted successfully",
          status: 'success'
        }
      })
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
      console.error(error);
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
      {product && (
        <>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
            title={`${product.name} Details`}
            image={product.image ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${product.image}` : null}
            data={data}
            onEdit={true}
            onRuplicate={true}
            onDelete={!product.deleted ? onAction : null}
            onRestore={product.deleted ? onAction : null}
            onHardDelete={onHardDelete}
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

