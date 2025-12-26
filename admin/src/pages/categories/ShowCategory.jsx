import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import categoryService from '@/services/categoryService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import Spinner from '@/components/UI/Spinner';

const ShowCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const getCategory = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategory(id);
      console.log(response.data)
      setCategory(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load category", { variant: 'error' });
    } finally {
      setLoading(false);
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
      {loading ? <Spinner/> :
      
        (
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
              type={'Category'}
              actions={
                category.deleted ? [
                  'edit', 'restore', 'hard-delete' 
                ] : [
                  'ruplicate', 'edit', 'soft-delete'
                ]
              }
              deleted={category.deleted}
              link={'/categories'}
            />
            <div className='h-15'/>
            <ProductsList propLimit={10} inner category={category._id}/>
          </>
        )
      }
    </MainLayout>
  )
}

export default ShowCategory