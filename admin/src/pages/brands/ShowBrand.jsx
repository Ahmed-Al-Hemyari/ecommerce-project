import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import defaultBrandImage from '@/assets/default-brand-image.jpg'
import brandService from '@/services/brandService';
import Spinner from '@/components/UI/Spinner';

const ShowBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBrand = async () => {
    setLoading(true);
    try {
      const response = await brandService.getBrand(id);
      console.log(response.data)
      setBrand(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load brand", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBrand();
  }, []);

  const data = [
    {
      label: 'Name',
      value: brand.name,
    },
  ];

  return (
    <MainLayout>
      {loading ? <Spinner/> : (
        <>
          <button
            onClick={() => navigate('/brands')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
            title={`${brand.name} Details`}
            image={brand.logo ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${brand.logo}` : defaultBrandImage}
            data={data}
            type={'Brand'}
            actions={
              brand.deleted ? [
                'edit', 'restore', 'hard-delete' 
              ] : [
                'ruplicate', 'edit', 'soft-delete'
              ]
            }
            deleted={brand.deleted}
            link={'/brands'}
          />
          <div className='h-15'/>
          <ProductsList propLimit={10} propProducts={brand.products} inner brand={brand._id}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowBrand