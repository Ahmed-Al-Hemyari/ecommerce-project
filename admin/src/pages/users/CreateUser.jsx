import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import CreateForm from '@/components/UI/Forms/CreateForm'
import categoryService from '@/services/categoryService';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '@/services/userService';

const CreateUser = () => {
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  // Errors
  const [formError, setFormError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Validation
  const phoneValidation = () => {
    if (!phone.trim() || !password) {
      setFormError("Please fill all fields with *");
      return false;
    }

    // Combine country code + phone
    const fullPhone = (countryCode + phone.trim()).replace(/(?!^\+)[^\d]/g, "");

    if (!/^\+?[0-9]{9,15}$/.test(fullPhone)) {
      setPhoneError("Invalid phone number");
      return false;
    }

    return true;
  };

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

  const handleSubmit = async () => {
    setFormError('');

    if (!name || !email || !phone || !role) {
      setFormError('Please fill all fields with * ');
      return false;
    }

    setRole(role.toLowerCase());

    const fullPhone = (countryCode + phone.trim()).replace(/(?!^\+)[^\d]/g, "");

    if (!/^\+?[0-9]{9,15}$/.test(fullPhone)) {
      setPhoneError("Invalid phone number");
      return false;
    }

    try {
      const response = await userService.createUser({
        name: name,
        email: email,
        phone: fullPhone,
        role: role
      });
      return true;
    } catch (error) {
      enqueueSnackbar('Failed to add user');
      return false;
    }
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setFormError("");
  }

  const inputs = [
    { 
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'User name', 
      value: name, 
      setValue: setName 
    },
    { 
      label: 'Email', 
      important: true, 
      type: 'text', 
      placeholder: 'User email', 
      value: email,
      setValue: setEmail,
    },
    { 
      label: 'Phone', 
      important: true, 
      type: 'phone', 
      placeholder: 'User phone', 
      countryCode: countryCode,
      setCountryCode: setCountryCode,
      phone: phone,
      setPhone: setPhone,
    },
    { 
      label: 'Role', 
      important: true, 
      type: 'select',
      options: [
        { name: 'User' },
        { name: 'Admin' },
      ],
      placeholder: 'User role', 
      value: role,
      setValue: setRole,
    },
  ]
  return (
    <MainLayout>
      <CreateForm
        title='Create User'
        inputs={inputs}
        link={'/users'}
        formError={formError}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </MainLayout>
  )
}

export default CreateUser