import React, { useState } from 'react'
import ProfileLayout from '@/components/Layouts/ProfileLayout';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import {allCountries} from 'country-telephone-data'
import extractPhoneParts from '@/utils/ExtractPhoneParts';
import authService from '@/services/authService';

const EditProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { countryCode: initialCode, number: initialNumber } =
        extractPhoneParts(user.phone, allCountries);

    const navigate = useNavigate();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(initialNumber);
    const [countryCode, setCountryCode] = useState(initialCode);

    // Errors
    const [formError, setFormError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setFormError("");
        setPhoneError("");
    
        // Trim input values
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
    
        // Required fields check
        if (!trimmedName || !trimmedEmail || !trimmedPhone) {
            setFormError("Please fill all fields with *");
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
            const response = await authService.updateProfile({name: trimmedName, email: trimmedEmail, phone: normalizedPhone});
            console.log("Updated:", response);

            localStorage.setItem("user", JSON.stringify(response.data.user));
    
            // Navigate to login page with snackbar message
            navigate("/profile", {
            state: {
                message: "Profile updated successfully.",
                status: "success"
            }
            });
        } catch (error) {
            console.error("Updating error:", error.message);
            setFormError(error.message || "Something went wrong");
        }
    }

    return (
        <ProfileLayout>
            <AuthLayout>
                <div className="flex w-full items-center mb-8">
                    <h1 className='text-3xl font-bold mx-auto'>Update Profile</h1>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <p className='text-sm text-red-500 my-2'>{formError}</p>
                    <div>
                    <label className="block mb-1 font-medium">Name <span className='text-red-500'>*</span></label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    </div>

                    <div>
                    <label className="block mb-1 font-medium">Email <span className='text-red-500'>*</span></label>
                    <input
                        type="email"
                        placeholder="example@mail.com"
                        className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
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

                    <button
                    type="submit"
                    className="w-full cursor-pointer py-3 mt-2 rounded-lg bg-(--color-green) text-(--color-dark-gray) font-semibold hover:opacity-90"
                    >
                    Update Profile
                    </button>
                </form>
            </AuthLayout>
        </ProfileLayout>
    )
}

export default EditProfile