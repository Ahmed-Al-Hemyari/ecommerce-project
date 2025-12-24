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
      setBrand(response.data);
      console.log(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load brand", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const onAction = async () => {
    const deleted = brand.deleted;

    try {
      const result = await Swal.fire({
        title: deleted ? 'Restore Brand' : 'Delete Brand',
        text: `Sure you want to ${deleted ? 'restore' : 'delete'} this brand?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${deleted ? 'restore' : 'delete'} it`,
        confirmButtonColor: deleted ? '#2222dd' : '#aa2222',

        // 🔥 loading handling
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            if (deleted) {
              await brandService.restore([id]);
            } else {
              await brandService.softDelete([id]);
            }
          } catch (error) {
            Swal.showValidationMessage(
              `Failed to ${deleted ? 'restore' : 'delete'} brand`
            );
          }
        }
      });

      if (result.isConfirmed) {
        navigate('/brands', {
          state: {
            message: `Brand ${deleted ? 'restored' : 'deleted'} successfully`,
            status: 'success'
          }
        });
      }

    } catch (error) {
      enqueueSnackbar(
        `Failed to ${deleted ? 'restore' : 'delete'} brand`,
        { variant: 'error' }
      );
    }
  };


  const onHardDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Delete Brand Permanently',
        text: 'Sure you want to delete this brand permanently?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d50101',

        // 🔥 loading handling
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            await brandService.hardDelete([id]);
          } catch (error) {
            Swal.showValidationMessage('Failed to delete brand permanently');
          }
        }
      });

      if (result.isConfirmed) {
        navigate('/brands', {
          state: {
            message: 'Brand deleted successfully',
            status: 'success'
          }
        });
      }

    } catch (error) {
      enqueueSnackbar('Failed to delete brand', { variant: 'error' });
      console.error(error);
    }
  };


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
            data={data}
            image={brand.logo ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${brand.logo}` : defaultBrandImage}
            onEdit={true}
            onRuplicate={true}
            onDelete={!brand.deleted ? onAction : null}
            onRestore={brand.deleted ? onAction : null}
            onHardDelete={onHardDelete}
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