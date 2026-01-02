import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { readLocalStorageItem } from '../services/LocalStorageFunctions';
import { authService } from '../services/api-calls';

const MainLayout = ({ page, children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, log out!",
      confirmButtonColor: "#82E2BB",
      allowOutsideClick: false,
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await authService.logout();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (error) {
          Swal.showValidationMessage("Logout failed");
          return false;
        }
      }
    });

    if (result.isConfirmed) {
      setUser(null);
      navigate('/login', {
        state: { message: "Logged out successfully", status: "success" }
      });
    }
  };

  /* ---------------- AUTH CHECK ---------------- */
  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const response = await authService.checkAuth();

      // OPTIONAL but recommended:
      // if backend returns user → use it
      if (response?.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        // fallback to localStorage
        const storedUser = readLocalStorageItem('user');
        setUser(storedUser ?? null);
      }
    } catch (error) {
      console.error("Auth check failed");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      enqueueSnackbar("Session expired", { variant: "warning" });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Navbar
        page={page}
        user={user}
        isLoading={authLoading}
        logout={handleLogout}
      />

      <div className="bg-gray-50 text-gray-800 min-h-[calc(100vh-2rem)]">
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
