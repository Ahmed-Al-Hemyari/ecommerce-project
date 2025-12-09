import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack'
import DataTable from '@/components/DataTable';

const UsersList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const headers = [
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phone" },
    { label: "Role", field: "role" },
    { label: "Joined", field: "createdAt" },
  ];


  const getUsers = async () => {
    try {
      const response = await userService.getUsers();
      const formatted = response.data.map(user => ({
        ...user,
        role: String(user.role),
        createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      }));
      setUsers(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load users", { variant: 'error' });
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

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

  return (
    <MainLayout>
      <DataTable
        headers={headers}
        link='/users'
        data={users}
        tableName='Users Table'
      />
    </MainLayout>
  )
}

export default UsersList