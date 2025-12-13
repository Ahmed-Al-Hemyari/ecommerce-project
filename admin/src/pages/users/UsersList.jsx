import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';

const UsersList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState(null);

  const headers = [
    { label: "Name", field: "name", type: 'link', link: 'users' },
    { label: "Email", field: "email", type: 'string' },
    { label: "Phone", field: "phone", type: 'string' },
    { label: "Role", field: "role", type: 'string' },
    { label: "Joined", field: "createdAt", type: 'string' },
  ];

  const getUsers = async (search, role) => {
    try {
      const response = await userService.getUsers(search, role);
      const formatted = response.data.map(user => ({
        ...user,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
      setUsers(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load users", { variant: 'error' });
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete User',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await userService.deleteUser(id);
      enqueueSnackbar("User deleted successfully", { variant: 'success' });
      getUsers(search, role);
    } catch (error) {
      enqueueSnackbar("Failed to delete user", { variant: 'error' });
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers(search, role);
  }, [search, role]);

  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const filters = [
    {
      label: 'Role',
      options: [
        { name: 'Admin', _id: 'admin' },
        { name: 'User', _id: 'user' },
      ],
      placeholder: 'Choose role',
      value: role,
      setValue: setRole,
    },
  ];

  return (
    <MainLayout>
      <DataTable
        headers={headers}
        link='/users'
        data={users}
        search={search}
        setSearch={setSearch}
        filters={filters}
        tableName='Users'
        handleDelete={handleDelete}
      />
    </MainLayout>
  );
};

export default UsersList;
