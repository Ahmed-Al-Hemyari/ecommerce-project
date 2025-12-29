import MainLayout from '@/components/Layouts/MainLayout'
import CreateForm from '@/components/UI/Forms/CreateForm'
import Spinner from '@/components/UI/Spinner';
import orderService from '@/services/orderService';
import { shippingService } from '@/services/shippingService';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'

const CreateOrder = () => {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formError, setFormError] = useState('');
  // Data
  const [users, setUsers] = useState([]);
  const [shippings, setShippings] = useState([]);
  // Fields
  const [user, setUser] = useState('');
  const [shipping, setShipping] = useState();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);

  // Inputs
  const inputs = [
    { 
      label: 'User', 
      important: true, 
      type: 'select', 
      placeholder: 'Select User...', 
      options: users,
      value: user, 
      setValue: setUser 
    },
    { 
      label: 'Shipping', 
      important: true, 
      type: 'dropdown', 
      placeholder: 'Select Shipping...',
      fullWidth: true,
      disabled: !user,
      options: shippings,
      value: shipping, 
      setValue: setShipping
    },
    { 
      label: 'Payment Method', 
      important: true, 
      type: 'dropdown',
      fullWidth: true,
      placeholder: 'Select Payment Method...', 
      options: [
        {name: 'Cash on Delivery', _id: 'cod'}, 
        {name: 'Credit/Debit Card', _id: 'card'}, 
        {name: 'PayPal', _id: 'paypal'}
      ],
      value: paymentMethod,
      setValue: setPaymentMethod
    },
    {
      label: 'Shipping Cost',
      important: true,
      type: 'number',
      value: shippingCost,
      setValue: setShippingCost
    }
  ];

  const getUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      enqueueSnackbar('Failed to fetch users', { variant: 'error' });
      console.error(error);
    } finally {
      setLoadingFetch(false);
    }
  }

  const getShippings = async () => {
    try {
      const response = await shippingService.getShippingsForUser(user);
      setShippings(response.data.shippings);
    } catch (error) {
      enqueueSnackbar('Failed to fetch shippings', { variant: 'error' });
      console.error(error);
    } finally {
      setLoadingFetch(false);
    }
  }

  const handleSubmit = async () => {
    setFormError('');
    setLoadingSubmit(true);

    if (!user || !shipping || !paymentMethod || !shippingCost) {
      setFormError('Please fill all required fields');
      setLoadingSubmit(false);
      return false;
    }

    try {
      const payload = {
        'user_id': user,
        'shipping_id': shipping,
        'payment_method': paymentMethod,
        'shipping_cost': shippingCost
      }
      const response = await orderService.createOrder(payload);
      return true;
    } catch (error) {
      enqueueSnackbar(error || 'Failed to create order', { variant: 'error' });
      console.error(error);
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  }

  const resetForm = () => {
    setUser('');
    setShipping('');
    setPaymentMethod('');
    setShippingCost(0);
    setFormError('');
  }

  useEffect(() => {
    setLoadingFetch(true);
    getUsers();
  }, []);
  
  useEffect(() => {
    if (!user) {
      setShippings([]);
      setShipping(undefined);
      return;
    }

    setLoadingFetch(true);
    getShippings();
  }, [user]);


  return (
    <MainLayout>
      {loadingFetch ? <Spinner/> : (
        <CreateForm
          title='Create Order'
          inputs={inputs}
          link={'/orders'}
          loading={loadingSubmit}
          formError={formError}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}
    </MainLayout>
  )
}

export default CreateOrder