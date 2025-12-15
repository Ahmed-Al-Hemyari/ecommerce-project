import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

const ProfileLayout = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sure you want to log out?",
      icon: "question",
      showCloseButton: true,
      confirmButtonText: "Yes, log out!",
      showCancelButton: true,
      confirmButtonColor: "#82E2BB"
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);

    enqueueSnackbar("Logged out successfully", { variant: 'success' });
    navigate('/'); // redirect to home
  };

  const checkAuth = async () => {
    // 1. Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    // Check auth form api
    try {
      const response = await authService.checkAuthAndAdmin();
      if(!response)
      {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }
    } catch (error) {
      console.error('failed to check authenication');
      enqueueSnackbar("Authenication Error");
      return;
    }

    // 3. Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Navbar user={user} logout={handleLogout}/>
      <div className="bg-gray-50 text-gray-800 min-h-[calc(100vh-5rem)] pt-20">
        {children}
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default ProfileLayout;
