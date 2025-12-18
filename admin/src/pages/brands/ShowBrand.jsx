import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductsList from '../products/ProductsList';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
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

  const onAction = async () => {
    const deleted = brand.deleted;
    try {
      const result = await Swal.fire({
        title: `${deleted ? 'Restore Brand' : 'Delete Brand'}`,
        text: `Sure you want to ${deleted ? 'restore' : 'delete'} this brand??`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${deleted ? 'restore' : 'delete'} it`,
        confirmButtonColor: `${deleted ? '#2222dd' : '#aa2222'}`
      });

      if (!result.isConfirmed) return;
      
      if (deleted) {
        const response = await brandService.restoreBrand([id]);
        navigate('/brands', {
          state: {
            message: "Brand restored successfully",
            status: 'success'
          }
        })
      } else {
        const response = await brandService.deleteBrand([id]);
        navigate('/brands', {
          state: {
            message: "Brand deleted successfully",
            status: 'success'
          }
        })
        
      }
    } catch (error) {
      enqueueSnackbar(`Failed to ${deleted ? 'restore' : 'delete'} brand`);
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
      {brand && (
        <>
          <button
            onClick={() => navigate('/brands')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
            title={`${brand.name} Details`}
            data={data}
            image={brand.logo ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${brand.logo}` : null}
            onEdit={true}
            onRuplicate={true}
            onDelete={!brand.deleted ? onAction : null}
            onRestore={brand.deleted ? onAction : null}
            deleted={brand.deleted}
            link={'/brands'}
          />
          <div className='h-15'/>
          <ProductsList propLimit={10} inner brand={brand._id}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowBrand