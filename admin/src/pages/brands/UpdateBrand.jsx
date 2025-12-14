import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CreateForm from '@/components/UI/Forms/CreateForm';
import brandService from '@/services/brandService';
import { enqueueSnackbar } from 'notistack';

const UpdateBrand = () => {
  // id
  const { id } = useParams();
  // Current Brand
  const [brand, setBrand] = useState([]);
  // Fields
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [formError, setFormError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });

      // Clear state to prevent showing again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  
  const getBrand = async (id) => {
    try {
      const response = await brandService.getBrand(id);
      setName(response.data.name);
    } catch (error) {
      enqueueSnackbar('Failed to load brand', { variant: 'error' });
      console.error(error);
    }
  }
  
  useEffect(() => {
    getBrand(id);
  }, []);

  const handleSubmit = async () => {
    setFormError('');

    if (!name) {
      setFormError('Please fill all fields with * ');
      return false;
    }

    const formData = new FormData();
    formData.append('name', name);
    if(logo) formData.append('file', logo);

    try {
      const response = await brandService.updateBrand(id, formData);
      return true;
    } catch (error) {
      return false;
    }
  }

  const resetForm = () => {
    setName("");
    setLogo("");
    setFormError("");
  }

  const inputs = [
    {
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Brand name', 
      value: name, 
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
  ]
  return (
    <MainLayout>
      <CreateForm
        formTitle='Create Brand'
        title='Brand'
        inputs={inputs}
        link={'/brands'}
        isUpdate={true}
        formError={formError}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </MainLayout>
  )
}

export default UpdateBrand