import React, { useEffect, useState } from 'react'
import logo from "@/assets/quickbuylogo.svg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/Layouts/AuthLayout';
import {useSnackbar} from 'notistack'
import { allCountries } from 'country-telephone-data';
import authService from '@/services/authService';
import PhoneInput from '@/components/UI/Forms/PhoneInput';
import Input from '@/components/UI/Forms/Input';
import { Loader2 } from 'lucide-react';


const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  // Navigate
  const navigate = useNavigate();

  // Login Method
  const [phoneLogin, setPhoneLogin] = useState(false);

  // Errors
  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    if(location.state?.message)
    {
      enqueueSnackbar(location.state.message, {variant: location.state.status});
    }
  }, [location.state])

  const emailValidation = (email, password) => {
    if (!email.trim() || !password) {
      setFormError('Please fill all fields with *');
      return false;
    }

    return true;
  }

  const phoneValidation = (phone, password) => {
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setFormError("");
    setPhoneError("");

    let isValid = false;

    if (phoneLogin) {
      isValid = phoneValidation(phone, password);
    } else {
      isValid = emailValidation(email, password);
    }
    
    if (!isValid) {
      setLoading(false);
      return; 
    }

    try {
      let data;
      if (phoneLogin) {
        const fullPhone = countryCode + phone.trim(); // include country code
        data = await authService.loginByPhone({phone: fullPhone, password: password});
      } else {
        data = await authService.loginByEmail({email, password});
      }

      // console.log(data);
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      resetForm();
      navigate("/", {
        state: {
          message: "Logged in successfully",
          status: "success"
        }
      });
    } catch (error) {
      console.error(error);
      setFormError(error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
};


  const resetForm = () => {
    setEmail("");
    setPhone("");
    setPassword("");

    // clear errors
    setFormError("");
    setPhoneError("");
  };


  return (
    <AuthLayout>
        {/* Logo */}
        <img
            src={logo}
            alt="QuickBuy logo"
            className="w-40 mx-auto mb-6 object-contain drop-shadow"
        />
        <p className="text-center text-gray-600 mb-8">Welcome back! Log in to continue.</p>

        {/* Login Method */}
        <div className='flex w-full'>
          <button 
            className={`w-1/2 mr-1 cursor-pointer py-3 rounded-lg font-medium 
              ${!phoneLogin 
                ? 'bg-(--color-green) text-(--color-dark-gray) border border-(--color-green)' 
                : 'bg-white text-gray-700 border border-(--color-light-gray)'} 
              hover:opacity-90 transition-all duration-150`}
            onClick={() => {
              setPhoneLogin(false);
              resetForm();
            }}  
          >
            Email
          </button>
          <button 
            className={`w-1/2 ml-1 cursor-pointer py-3 rounded-lg font-medium 
              ${phoneLogin 
                ? 'bg-(--color-green) text-(--color-dark-gray) border border-(--color-green)' 
                : 'bg-white text-gray-700 border border-(--color-light-gray)'} 
              hover:opacity-90 transition-all duration-150`}
            onClick={() => {
              setPhoneLogin(true)
              resetForm();
            }}
          >
            Phone
          </button>
        </div>


        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className='text-sm text-red-500 my-2'>{formError}</p>
          {/* Email Input */}
          <div className={phoneLogin ? 'hidden' : 'block'}>
            <Input
              label='Email'
              important
              type='email'
              placeholder='example@gmail.com'
              value={email}
              setValue={setEmail}
              formError={formError}
            />
          </div>

          {/* Phone Input */}
          <PhoneInput 
            phoneLogin={phoneLogin}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phone={phone}
            setPhone={setPhone}
            phoneError={phoneError}
            formError={formError}
          />

          {/* Password Input */}
          <Input
            label='Password'
            important
            type='password'
            placeholder='••••••••'
            value={password}
            setValue={setPassword}
            formError={formError}
          />

          <button
            type="submit"
            className={
              `w-full cursor-pointer flex flex-row items-center justify-center
              py-3 mt-2 rounded-lg bg-(--color-green) 
              text-(--color-dark-gray) font-semibold hover:opacity-90 ${
                loading ? 
                  'bg-(--color-green)/50 cursor-not-allowed' : 
                  'bg-(--color-green) hover:opacity-90'
              }`
            }
            disabled={loading}
          >
            {(loading) && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
            Login
          </button>
        </form>
    </AuthLayout>
  )
}

export default Login