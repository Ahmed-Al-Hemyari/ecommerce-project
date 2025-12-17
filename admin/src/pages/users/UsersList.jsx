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
  // Laoding
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(50);
  // bulk
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const headers = [
    { label: "Name", field: "name", type: 'string' },
    { label: "Email", field: "email", type: 'string' },
    { label: "Phone", field: "phone", type: 'string' },
    { label: "Role", field: "role", type: 'string' },
    { label: "Joined", field: "createdAt", type: 'string' },
  ];

  const getUsers = async (search, role, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await userService.getUsers(search, role, currentPage, limit);
      const formatted = response.data.users.map(user => ({
        ...user,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
      setUsers(formatted);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar("Failed to load users", { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
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
    getUsers(search, role, currentPage, limit);
  }, [search, role, currentPage, limit]);

  // Bulk Actions useEffect
  useEffect(() => {
    if (!bulkAction) return;

    const runBulkAction = async () => {
      if (bulkAction === 'delete') {
        await deleteSeleted();
      } else if (bulkAction === 'grant-admin') {
        await grantAdmin();
      } else if (bulkAction === 'revoke-admin') {
        await revokeAdmin();
      }
    };

    runBulkAction();
  }, [bulkAction]);


  // Bulk Actions functions
  const deleteSeleted = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Delete Users',
      text: `Are you sure you want to delete ${selected.length} users?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await userService.deleteMany(selected);
      enqueueSnackbar("Users deleted successfully", { variant: 'success' });
      setSelected([]);
      getUsers(search, role, currentPage, limit);
    } catch (error) {
      enqueueSnackbar("Failed to delete users", { variant: 'error' });
      console.error(error);
    }
  }

  const grantAdmin = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Grant Admin',
      text: `Are you sure you want to grant admin for selected users?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, grant them',
      confirmButtonColor: '#1d7451',
    });

    if (!result.isConfirmed) return;

    try {
      await userService.grantAdmin(selected);
      enqueueSnackbar("Administration granted successfully", { variant: 'success' });
      setSelected([]);
      getUsers(search, role);
    } catch (error) {
      enqueueSnackbar("Failed to grant admin", { variant: 'error' });
      console.error(error);
    }
  }

  const revokeAdmin = async () => {
    setBulkAction('');
    const result = await Swal.fire({
      title: 'Revoke Admin',
      text: `Are you sure you want to revoke admin for selected users?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, revoke admin',
      confirmButtonColor: '#1d7451',
    });

    if (!result.isConfirmed) return;

    try {
      await userService.revokeAdmin(selected);
      enqueueSnackbar("Administration revoked successfully", { variant: 'success' });
      setSelected([]);
      getUsers(search, role);
    } catch (error) {
      enqueueSnackbar("Failed to revoke admin", { variant: 'error' });
      console.error(error);
    }
  }


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
        // Loading
        loading={loading}
        setLoading={setLoading}
        // Pagination
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit} setLimit={setLimit}
        // bulk
        selected={selected}
        setSelected={setSelected}
        setBulkAction={setBulkAction}
        bulkActions={[
          { name: 'Grant admin', _id: 'grant-admin'},
          { name: 'Revoke admin', _id: 'revoke-admin'},
          { name: 'Delete Selected', _id: 'delete', color: 'red-600'},
        ]}
      />
    </MainLayout>
  );
};

export default UsersList;
