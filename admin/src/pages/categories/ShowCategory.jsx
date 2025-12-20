import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import categoryService from '@/services/categoryService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const ShowCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  const getCategory = async () => {
    try {
      const response = await categoryService.getCategory(id);
      setCategory(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load category", { variant: 'error' });
    }
  }

  const onAction = async () => {
    const deleted = category.deleted;
    try {
      const result = await Swal.fire({
        title: `${deleted ? 'Restore Category' : 'Delete Category'}`,
        text: `Sure you want to ${deleted ? 'restore' : 'delete'} this category??`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${deleted ? 'restore' : 'delete'} it`,
        confirmButtonColor: `${deleted ? '#1d7451' : '#d50101'}`
      });

      if (!result.isConfirmed) return;
      
      if (deleted) {
        const response = await categoryService.restoreCategory([id]);
        navigate('/categories', {
          state: {
            message: "Category restored successfully",
            status: 'success'
          }
        })
      } else {
        const response = await categoryService.deleteCategory([id]);
        navigate('/categories', {
          state: {
            message: "Category deleted successfully",
            status: 'success'
          }
        })
        
      }
    } catch (error) {
      enqueueSnackbar(`Failed to ${deleted ? 'restore' : 'delete'} category`);
    }
  }

  const onHardDelete = async () => {
    const result = Swal.fire({
      title: 'Delete Category Permenantly',
      text: 'Sure you want to delete this category permenantly??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await categoryService.hardDelete([id]);
      enqueueSnackbar(response.data, {
        variant: 'success'
      });
      navigate('/categories', {
        state: {
          message: "Category deleted successfully",
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
    getCategory();
  }, []);

  const data = [
    {
      label: 'Name',
      value: category.name
    },
    {
      label: 'Slug',
      value: category.slug
    },
  ];

  return (
    <MainLayout>
      {category && (
        <>
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
            title={`${category.name} Details`}
            data={data}
            onEdit={true}
            onRuplicate={true}
            onDelete={!category.deleted ? onAction : null}
            onRestore={category.deleted ? onAction : null}
            onHardDelete={onHardDelete}
            deleted={category.deleted}
            link={'/categories'}
          />
          <div className='h-15'/>
          <ProductsList propLimit={10} inner category={category._id}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowCategory