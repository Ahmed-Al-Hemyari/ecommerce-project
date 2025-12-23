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

  const onAction = async () => {
    const deleted = category.deleted;

    try {
      const result = await Swal.fire({
        title: deleted ? 'Restore Category' : 'Delete Category',
        text: `Sure you want to ${deleted ? 'restore' : 'delete'} this category?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${deleted ? 'restore' : 'delete'} it`,
        confirmButtonColor: deleted ? '#1d7451' : '#d50101',

        // 🔥 IMPORTANT PART
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            if (deleted) {
              await categoryService.restore([id]);
            } else {
              await categoryService.softDelete([id]);
            }
          } catch (error) {
            Swal.showValidationMessage(
              `Failed to ${deleted ? 'restore' : 'delete'} category`
            );
          }
        }
      });

      // If confirmed & API succeeded
      if (result.isConfirmed) {
        navigate('/categories', {
          state: {
            message: `Category ${deleted ? 'restored' : 'deleted'} successfully`,
            status: 'success'
          }
        });
      }

    } catch (error) {
      enqueueSnackbar(
        `Failed to ${deleted ? 'restore' : 'delete'} category`,
        { variant: 'error' }
      );
    }
  };


  const onHardDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Category Permenantly',
      text: 'Sure you want to delete this category permenantly??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101',
      confirmButtonColor: '#d50101',
      allowOutsideClick: false,
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await categoryService.hardDelete([id]);
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
          return false;
        }
      }
    })

    if (result.isConfirmed) {
      navigate('/categories', {
        state: {
          message: "Category deleted successfully",
          status: 'success'
        }
      })
      return;
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
        )
      }
    </MainLayout>
  )
}

export default ShowCategory