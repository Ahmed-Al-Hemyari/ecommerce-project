import React, { useEffect, useState } from 'react'
import logo from "@/assets/quickbuylogo.svg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from "@/layouts/AuthLayout";
import {
  authService
} from '../../services/api-calls.js'
import {useSnackbar} from 'notistack'
import {allCountries} from 'country-telephone-data'
import { Loader2 } from 'lucide-react'


const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  // Navigate
  const navigate = useNavigate();
  // loading
  const [loading, setLoading] = useState(false);

  // Login Method
  const [phoneLogin, setPhoneLogin] = useState(false);

  // Errors
  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
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
      let response;
      if (phoneLogin) {
        const fullPhone = countryCode + phone.trim(); // include country code
        response = await authService.loginByPhone({phone: fullPhone, password});
      } else {
        response = await authService.loginByEmail({email, password});
      }
      
      localStorage.setItem("token", response.data.token || "");
      localStorage.setItem("user", JSON.stringify(response.data.user || null));

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
                ? 'bg-(--color-green) text-white border border-(--color-green)' 
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
                ? 'bg-(--color-green) text-white border border-(--color-green)' 
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
            <label className="block mb-1 font-medium">Email <span className='text-red-500'>*</span></label>
            <input
              type='email'
              placeholder='example@email.com'
              value={email}
              className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          {/* Phone Input */}
          <div className={phoneLogin ? 'block' : 'hidden'}>
            <label className="block mb-1 font-medium">
              Phone <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 italic my-1">
              Enter your phone number without leading zeros or extra characters.
            </p>

            <div className="flex">
              {/* Country Code Dropdown */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2 rounded-l-lg border border-(--color-light-gray) focus:outline-none focus:ring-2 focus:ring-(--color-green)"
              >
                {allCountries.map((c, index) => (
                  <option key={c.iso2} value={c.dialCode}>
                    {c.iso2.toUpperCase()} ({c.dialCode})
                  </option>
                ))}
              </select>

              {/* Phone Input */}
              <input
                type="tel"
                placeholder="123 456 7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-r-lg border ${
                  phoneError || formError
                    ? "border-red-500"
                    : "border-(--color-light-gray)"
                } focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              />
            </div>
            <p className="text-sm text-red-500 my-2">{phoneError}</p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block mb-1 font-medium">Password <span className='text-red-500'>*</span></label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow border-b border-(--color-light-gray)"></div>
          <span className="mx-2 text-gray-500">or</span>
          <div className="grow border-b border-(--color-light-gray)"></div>
        </div>

        <Link to={'/'}>
            <button className="w-full cursor-pointer py-3 rounded-lg border border-(--color-dark-gray) font-medium hover:bg-gray-100">
              Continue as Guest
            </button>
        </Link> 

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{' '}
          <Link to={'/register'} className="text-(--color-green) font-semibold hover:underline">Sign up</Link>
        </p>
    </AuthLayout>
  )
}

export default Login