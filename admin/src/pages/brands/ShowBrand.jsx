import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import brandService from '@/services/brandService';

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
          <ShowCard
            title={`${brand.name} Details`}
            image={brand.logo ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${brand.logo}` : null}
            data={data}
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