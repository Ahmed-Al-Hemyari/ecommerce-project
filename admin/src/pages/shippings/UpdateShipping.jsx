import MainLayout from '@/components/Layouts/MainLayout';
import CreateForm from '@/components/UI/Forms/CreateForm'
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import Spinner from '@/components/UI/Spinner';
import { shippingService } from '@/services/shippingService';
import userService from '@/services/userService';
import { countries } from '@/utils/countries';
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

    const getUsers = async () => {
        try {
            const response = await userService.getUsers();
            setUsers(response.data.users);
        } catch (error) {
            enqueueSnackbar('Failed to load users', { variant: 'error' });
            console.error(error);
        }
    }

    const getShipping = async () => {
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
        { label: 'User', type: 'select', options: users, value: user, setValue: setUser, important: true },
        { label: 'Address Line 1', type: 'text', value: address1, setValue: setAddress1, important: true },
        { label: 'Address Line 2', type: 'text', value: address2, setValue: setAddress2 },
        { label: 'City', type: 'text', value: city, setValue: setCity, important: true },
        { label: 'Country', type: 'select', options: countries, value: country, setValue: setCountry, important: true },
        { label: 'ZIP Code', type: 'text', value: zip, setValue: setZip, important: true },
    ]

    useEffect(() => {

        const getData = async () => {
            setLoadingFetch(true);

            await getUsers();
            await getShipping();

            setLoadingFetch(false);
        }

        getData();        
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
            { loadingFetch ? <Spinner/> : (
                <UpdateForm
                    inputs={inputs}
                    title='Update Shipping'
                    link='/users'
                    handleSubmit={handleSubmit}
                    loading={loadingSubmit}
                    formError={formError}
                    resetForm={resetForm}
                />
            )}
        </MainLayout>
    )
}

export default UpdateShipping