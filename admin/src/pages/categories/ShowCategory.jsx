import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import categoryService from '@/services/categoryService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import { ArrowLeft } from 'lucide-react';

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



  const edit = () => {
    navigate(`/category/update/${category._id}`);
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
            onEdit={edit}
            backTo={'/categories'}
          />
          <div className='h-15'/>
          <ProductsList propLimit={10} inner category={category._id}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowCategory