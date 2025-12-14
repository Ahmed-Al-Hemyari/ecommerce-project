import React, { useState } from 'react'
import { allCountries } from 'country-telephone-data';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/api-calls';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  // Errors
  const [formError, setFormError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError('');
    setPasswordConfirmation('');

    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedPasswordConfirmation = passwordConfirmation.trim();

    if (!trimmedOldPassword || !trimmedNewPassword || !trimmedPasswordConfirmation) {
      setFormError("Fill all fields with *");
      return;
    }

    // Password confirmation check
    if (trimmedNewPassword !== trimmedPasswordConfirmation) {
      setPasswordConfirmationError("Password confirmation is different than the password!!");
      return;
    }

    try {
        // Call register API
        const data = await authService.changePassword({
            oldPassword: trimmedOldPassword, 
            newPassword: trimmedNewPassword
        });
        console.log("Password Updated Successfully: ", data);

        // Navigate to login page with snackbar message
        navigate("/profile", {
        state: {
            message: "Password updated successfully.",
            status: "success"
        }
        });
    } catch (error) {
        console.error("Updating error:", error.message);
        setFormError(error.message || "Something went wrong");
    }
  }
  return (
    <MainLayout>
            <AuthLayout>
                <div className="flex w-full items-center mb-8">
                    <h1 className='text-3xl font-bold mx-auto'>Change Password</h1>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <p className='text-sm text-red-500 my-2'>{formError}</p>
                    <div>
                    <label className="block mb-1 font-medium">Old Password <span className='text-red-500'>*</span></label>
                    <input
                        type="password"
                        placeholder="Old password"
                        className={`w-full px-4 py-2 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                        onChange={(e) => setOldPassword(e.target.value)}
                        value={oldPassword}
                    />
                    </div>

                    <div>
                    <label className="block mb-1 font-medium">New Password <span className='text-red-500'>*</span></label>
                    <input
                        type="password"
                        placeholder="New password"
                        className={`w-full px-4 py-2 rounded-lg border ${formError || passwordConfirmationError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                    />
                    {/* <p className='text-sm text-red-500 my-2 mx-2'>Error</p> */}
                    </div>

                    <div>
                    <label className="block mb-1 font-medium">Confirm New Password <span className='text-red-500'>*</span></label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        className={`w-full px-4 py-2 rounded-lg border ${formError || passwordConfirmationError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        value={passwordConfirmation}
                    />
                    <p className='text-sm text-red-500 my-2 mx-2'>{passwordConfirmationError}</p>
                    </div>

                    <button
                    type="submit"
                    className="w-full cursor-pointer py-3 mt-2 rounded-lg bg-(--color-green) text-(--color-dark-gray) font-semibold hover:opacity-90"
                    >
                    Change Password
                    </button>
                </form>
            </AuthLayout>
        </MainLayout>
  )
}

export default ChangePassword