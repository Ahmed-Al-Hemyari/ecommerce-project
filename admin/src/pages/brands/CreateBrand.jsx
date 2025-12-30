import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import CreateForm from '@/components/UI/Forms/CreateForm';
import brandService from '@/services/brandService';
import { enqueueSnackbar } from 'notistack';
import Spinner from '@/components/UI/Spinner';

const CreateBrand = () => {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [formError, setFormError] = useState('');
  // Loading
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  // Ruplicate
  const [brand, setBrand] = useState();

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

    if (location.state?.id) {
      const id = location.state?.id;
      setLoadingFetch(true);
      const fetchBrand = async () => {        
        try {
          const response = await brandService.getBrand(id);
          setBrand(response.data);
        } catch (error) {
          enqueueSnackbar(error || "Failed to add brand");
        } finally {
          setLoadingFetch(false);
        }
      }
      
      fetchBrand();
    }
  }, [location.state]);
  
  useEffect(() => {
    if(!brand) return;
    
    setName(brand.name);
  }, [brand]);

  const handleSubmit = async () => {
    setFormError('');
    setLoadingSubmit(true);

    if (!name || !logo) {
      setFormError('Please fill all fields with * ');
      setLoadingSubmit(false);
      return false;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', logo);

    try {
      const response = await brandService.createBrand(formData);
      return true;
    } catch (error) {
      setFormError(error || "Failed to add brand");
      return false;
    } finally {
      setLoadingSubmit(false);
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
      important: true, 
      type: 'file', 
      placeholder: '', 
      value: logo,
      setValue: setLogo,
      showPreview: true
    }
  ]
  return (
    <MainLayout>
      { loadingFetch ? <Spinner/> : (
          <CreateForm
            formTitle='Create Brand'
            title='Brand'
            inputs={inputs}
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

export default CreateBrand