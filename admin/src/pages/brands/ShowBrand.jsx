import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import brandService from '@/services/brandService';
import { ArrowLeft } from 'lucide-react';

const ShowBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState([]);

  const getBrand = async () => {
    try {
      const response = await brandService.getBrand(id);
      setBrand(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load brand", { variant: 'error' });
    }
  }

  const edit = () => {
    navigate(`/brands/update/${brand._id}`);
  }

  useEffect(() => {
    getBrand();
  }, []);

  const data = [
    {
      label: 'Name',
      value: brand.name
    },
  ];

  return (
    <MainLayout>
      { brand && (
        <>
          <button
            onClick={() => navigate('/brands')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
            title={`${brand.name} Details`}
            image={brand.logo ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${brand.logo}` : null}
            data={data}
            link={'/brands'}
            onEdit={edit}
            backTo={'/brands'}
          />
          <div className='h-15'/>
          <ProductsList propLimit={10} inner brand={brand._id}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowBrand