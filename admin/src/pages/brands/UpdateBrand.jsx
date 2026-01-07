import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import brandService from '@/services/brandService';
import { enqueueSnackbar } from 'notistack';
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import Spinner from '@/components/UI/Spinner';

const UpdateBrand = () => {
  // id
  const { id } = useParams();
  // Current Brand
  const [brand, setBrand] = useState([]);
  // Fields
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [formError, setFormError] = useState('');
  // Loading
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  const getBrand = async () => {
    setLoadingFetch(true);
    try {
      const response = await brandService.getBrand(id);
      setBrand(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load brand', { variant: 'error' });
      console.error(error);
    } finally {
      setLoadingFetch(false);
    }
  }
  
  useEffect(() => {
    getBrand();
  }, []);

  useEffect(() => {
    setName(brand.name);
    setLogo(brand.logo);
  }, [brand]);

  const handleSubmit = async () => {
    setFormError('');
    setLoadingSubmit(true);

    if (!name) {
      setFormError('Please fill all fields with * ');
    setLoadingSubmit(false);
      return false;
    }

    const formData = new FormData();
    formData.append('name', name);
    if(logo) formData.append('logo', logo);

    try {
      const response = await brandService.updateBrand(id, formData);
      return true;
    } catch (error) {
      enqueueSnackbar(error || 'Failed to update brand', { variant: 'error' });
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  }

  const resetForm = () => {
    if (!brand) return;
    setName(brand.name || '');
    setLogo('');
    setFormError('');
  };


  const inputs = [
    {
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Brand name', 
      value: name || '', 
      setValue: setName 
    },
    {
      label: 'Logo',
      type: 'file', 
      placeholder: '', 
      value: logo,
      setValue: setLogo,
      showPreview: true
    }
  ];

  return (
    <MainLayout>
      { loadingFetch ? <Spinner/> : (
        <UpdateForm
          inputs={inputs}
          title={`Update ${brand?.name || ''}`}
          link={'/brands'}
          loading={loadingSubmit}
          formError={formError}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}
    </MainLayout>
  )
}

export default UpdateBrand