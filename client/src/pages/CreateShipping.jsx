import MainLayout from '../layouts/MainLayout';
import CreateForm from '../components/CreateForm'
import Spinner from '../components/Spinner';
import { shippingService } from '../services/api-calls';
import { countries } from '../services/countries';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CreateShipping = () => {
    // Essentials
    const navigate = useNavigate();
    const location = useLocation();
    // Errors
    const [formError, setFormError] = useState('');
    // fields
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    // Loading
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setFormError('');
        
        if (!address1 || !city || !country || !zip) {
            setFormError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await shippingService.createShipping({
                address1, address2, city, country, zip
            });
            return true;
        } catch (error) {
            enqueueSnackbar(error || 'Failed to create shipping', { variant: 'error' });
            console.error(error);
            setFormError(error || 'An error occurred while creating shipping.');
            return false;
        } finally {
            setLoading(false);
        }
    }

    const resetForm = () => {
        setAddress1('');
        setAddress2('');
        setCity('');
        setCountry('');
        setZip('');
        setFormError('');
    }

    const inputs = [
        // { label: 'User', type: 'select', options: users, value: user, setValue: setUser, important: true },
        { label: 'Address Line 1', type: 'text', value: address1, setValue: setAddress1, important: true },
        { label: 'Address Line 2', type: 'text', value: address2, setValue: setAddress2 },
        { label: 'City', type: 'text', value: city, setValue: setCity, important: true },
        { label: 'Country', type: 'dropdown', options: countries, fullWidth: true, value: country, setValue: setCountry, important: true },
        { label: 'ZIP Code', type: 'text', value: zip, setValue: setZip, important: true },
    ]

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
            <h2 className='pt-5 pl-5 text-3xl font-bold'>Create Shipping</h2>
            <div className='px-20'>
                <CreateForm
                    inputs={inputs}
                    link={`/profile`}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    formError={formError}
                    resetForm={resetForm}
                    showCreateAndAddAnother={false}
                />
            </div>
        </MainLayout>
    )
}

export default CreateShipping