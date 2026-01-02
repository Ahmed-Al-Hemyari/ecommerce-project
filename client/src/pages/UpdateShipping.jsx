import MainLayout from '../layouts/MainLayout';
import UpdateForm from '../components/UpdateForm';
import Spinner from '../components/Spinner';
import { shippingService } from '../services/api-calls';
import { countries } from '../services/countries';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const UpdateShipping = () => {
    // Essentials
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // data
    const [users, setUsers] = useState([]);
    // Errors
    const [formError, setFormError] = useState('');
    // fields
    const [user, setUser] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    // Loading
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const getShipping = async () => {
      setLoadingFetch(true);
        try {
            const response = await shippingService.getShipping(id);
            setUser(response.data.shipping.user._id);
            setAddress1(response.data.shipping.address1);
            setAddress2(response.data.shipping.address2);
            setCity(response.data.shipping.city);
            setCountry(response.data.shipping.country);
            setZip(response.data.shipping.zip);
        } catch (error) {
            enqueueSnackbar('Failed to load shipping', { variant: 'error' });
            console.error(error);
        } finally {
          setLoadingFetch(false);
        }
    }

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        setFormError('');
        
        if (!address1 || !city || !country || !zip) {
            setFormError('Please fill in all required fields.');
            setLoadingSubmit(false);
            return;
        }

        if (!address2) {
            setAddress2('');
        }

        try {
            const payload = {
                user_id: user,
                address1,
                address2,
                city,
                country,
                zip,
            };

            const response = await shippingService.updateShipping(id, payload);
            return true;
        } catch (error) {
            enqueueSnackbar(error || 'Failed to create shipping', { variant: 'error' });
            console.error(error);
            setFormError(error || 'An error occurred while creating shipping.');
            return false;
        } finally {
            setLoadingSubmit(false);
        }
    }

    const resetForm = async () => {
        // setUser('');
        // setAddress1('');
        // setAddress2('');
        // setCity('');
        // setCountry('');
        // setZip('');
        // setFormError('');

        setLoadingFetch(true);
        await getShipping();
        setLoadingFetch(false);
    }

    const inputs = [
        { label: 'Address Line 1', type: 'text', value: address1, setValue: setAddress1, important: true },
        { label: 'Address Line 2', type: 'text', value: address2, setValue: setAddress2 },
        { label: 'City', type: 'text', value: city, setValue: setCity, important: true },
        { label: 'Country', type: 'select', options: countries, value: country, setValue: setCountry, important: true },
        { label: 'ZIP Code', type: 'text', value: zip, setValue: setZip, important: true },
    ]

    useEffect(() => {
      getShipping();
    }, []);

    useEffect(() => {
        if (location.state?.message) {
          enqueueSnackbar(location.state.message, {
            variant: location.state.status,
          });
    
          // Clear state to prevent showing again
          navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    return (
        <MainLayout>
            <h2 className='pt-5 pl-5 text-3xl font-bold'>Update Shipping</h2>
            <div className='px-20'>
              { loadingFetch ? <Spinner/> : (
                  <UpdateForm
                      inputs={inputs}
                      link='/profile'
                      handleSubmit={handleSubmit}
                      loading={loadingSubmit}
                      formError={formError}
                      resetForm={resetForm}
                  />
              )}
            </div>
        </MainLayout>
    )
}

export default UpdateShipping