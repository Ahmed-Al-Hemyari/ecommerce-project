import React, { useState } from 'react'
import logo from "@/assets/quickbuylogo.svg";
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from "@/layouts/AuthLayout";
import {useSnackbar} from 'notistack'
import {
  authService
} from '@/services/api-calls'
import {allCountries} from 'country-telephone-data'

const Register = () => {
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();

  // Variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  // Errors
  const [formError, setFormError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Navigation
  const navigate = useNavigate();

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormError("");
    setPasswordConfirmationError("");
    setPhoneError("");

    // Trim input values
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    const trimmedPasswordConfirmation = passwordConfirmation.trim();

    // Required fields check
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedPassword || !trimmedPasswordConfirmation) {
      setFormError("Please fill all fields with *");
      return;
    }

    // Password confirmation check
    if (trimmedPassword !== trimmedPasswordConfirmation) {
      setPasswordConfirmationError("Password confirmation is different than the password!!");
      return;
    }

    // Normalize phone: prepend country code and remove non-digit characters except leading +
    const normalizedPhone = (countryCode + trimmedPhone).replace(/(?!^\+)[^\d]/g, "");

    // Phone validation (9–15 digits, optional +)
    if (!/^\+?[0-9]{9,15}$/.test(normalizedPhone)) {
      setPhoneError("Invalid phone number");
      return;
    }

    try {
      // Call register API
      const data = await authService.register(trimmedName, trimmedEmail, normalizedPhone, trimmedPassword);
      console.log("Registered:", data);

      // Navigate to login page with snackbar message
      navigate("/login", {
        state: {
          message: "User registered successfully. Now login.",
          status: "success"
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      setFormError(error || "Something went wrong");
    }
  };


  return (
    <AuthLayout>
        {/* Logo */}
        <img
            src={logo}
            alt="QuickBuy logo"
            className="w-40 mx-auto mb-6 object-contain drop-shadow"
        />

        <p className="text-center text-gray-600 mb-8">Welcome to QuickBuy! Register to continue</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className='text-sm text-red-500 my-2'>{formError}</p>
          <div>
            <label className="block mb-1 font-medium">Name <span className='text-red-500'>*</span></label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email <span className='text-red-500'>*</span></label>
            <input
              type="email"
              placeholder="example@mail.com"
              className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <p className='text-sm text-red-500 my-2 mx-2'>Error</p> */}
          </div>

          <div>
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
                {allCountries.map((c) => (
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

          <div>
            <label className="block mb-1 font-medium">Password <span className='text-red-500'>*</span></label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg border ${passwordConfirmationError || formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password Confirmation <span className='text-red-500'>*</span></label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg ${passwordConfirmationError || formError ? 'border border-red-500' : 'border border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <p className='text-sm text-red-500 my-2'>{passwordConfirmationError}</p>
          </div>

          {/* <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              Remember me
            </label>
            <button type="button" className="text-(--color-green) hover:underline">
              Forgot password?
            </button>
          </div> */}

          <button
            type="submit"
            className="w-full cursor-pointer py-3 mt-2 rounded-lg bg-(--color-green) text-(--color-dark-gray) font-semibold hover:opacity-90"
          >
            Sign up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow border-b border-(--color-light-gray)"></div>
          <span className="mx-2 text-gray-500">or</span>
          <div className="grow border-b border-(--color-light-gray)"></div>
        </div>

        <Link to={'/'}>
            <button className="w-full py-3 cursor-pointer rounded-lg border border-(--color-dark-gray) font-medium hover:bg-gray-100">
            Continue as Guest
            </button>
        </Link> 

        <p className="text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to={'/login'} className="text-(--color-green) font-semibold hover:underline">Login</Link>
        </p>
    </AuthLayout>
  )
}

export default Register