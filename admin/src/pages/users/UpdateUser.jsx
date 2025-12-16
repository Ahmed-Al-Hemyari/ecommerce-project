import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import extractPhoneParts from '@/utils/ExtractPhoneParts';
import { allCountries } from 'country-telephone-data';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  // Fields
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
 
  // Errors
  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Get User
  const getUser = async () => {
    try {
      const response = await userService.getUser(id);
      setUser(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load user", { variant: 'error' });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!user?.phone) return;

    const { countryCode: code, number } =
      extractPhoneParts(user.phone, allCountries);

    setName(user.name || '');
    setEmail(user.email || '');
    setRole(user.role || '');
    setCountryCode(code || '');
    setPhone(number || '');
  }, [user]);

  // Inputs

  const inputs = [
    { 
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Name', 
      value: name, 
      setValue: setName 
    },
    { 
      label: 'Email', 
      important: true, 
      type: 'text', 
      placeholder: 'Email', 
      value: email, 
      setValue: setEmail 
    },
    { 
      label: 'Role', 
      important: true, 
      type: 'dropdown',
      options: [
        { name: 'User', _id: 'user' },
        { name: 'Admin', _id: 'admin' },
      ],
      placeholder: 'User role', 
      value: role,
      setValue: setRole,
    },
    { 
      label: 'Phone', 
      important: true, 
      type: 'phone', 
      placeholder: 'Phone', 
      countryCode: countryCode,
      setCountryCode: setCountryCode,
      phone: phone,
      setPhone: setPhone,
      formError: formError,
      phoneError: phoneError,
    },
  ];

  const handleSubmit = async () => {
    setFormError('');
    setPhoneError('');

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
      const response = await userService.updateUser(id, {
        name: name,
        email: email,
        phone: fullPhone,
        role: role
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  const resetForm = () => {
    if (!user?.phone) return;

    const { countryCode: code, number } =
      extractPhoneParts(user.phone, allCountries);

    setName(user.name || '');
    setEmail(user.email || '');
    setRole(user.role || '');
    setCountryCode(code || '');
    setPhone(number || '');
  }

  return (
    <MainLayout>
      <UpdateForm
        inputs={inputs}
        title={`Update ${user.name}`}
        link={'/users'}
        formError={formError}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </MainLayout>
  )
}

export default UpdateUser