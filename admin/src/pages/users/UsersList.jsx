import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';
import { grantAdmin, hardDelete, restore, revokeAdmin, softDelete } from '@/utils/Functions';

const UsersList = () => {

  // Essentials
  const location = useLocation();
  const navigate = useNavigate();
  // Type
  const type = 'User';
  // Data
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
  // Filters
  const [deletedFilter, setDeletedFilter] = useState(null);
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
    {
      label: 'Deleted',
      options: [
        { _id: true, name: 'Deleted' },
      ],
      placeholder: 'Choose...',
      value: deletedFilter,
      setValue: setDeletedFilter,
    }
  ];

  const headers = [
    { label: "Name", field: "name", type: 'string' },
    { label: "Email", field: "email", type: 'string' },
    { label: "Phone", field: "phone", type: 'string' },
    { label: "Role", field: "role", type: 'string' },
    { label: "Joined", field: "createdAt", type: 'string' },
  ];

  // Handlers

  const getUsers = async (search, role, deleted, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await userService.getUsers(search, role, deleted, currentPage, limit);
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

  const refreshUsers = () => 
    getUsers(search, role, deletedFilter, currentPage, limit);

  const handleSoftDelete = async (id) => {
    await softDelete(
      [id],
      type,
      setSelected,
      refreshUsers
    );
  }
  const handleRestore = async (id) => {
    await restore(
      [id],
      type,
      setSelected,
      refreshUsers
    );
  }
  const handleHardDelete = async (id) => {
    await hardDelete(
      [id],
      type,
      setSelected,
      refreshUsers
    );
  }

  // useEffects
  useEffect(() => {
    setLoading(true);
    refreshUsers();
  }, [search, role, deletedFilter, currentPage, limit]);

  // Bulk Actions useEffect
  useEffect(() => {
    if (!bulkAction) return;

    const runBulkAction = async () => {
      switch (bulkAction) {
        case 'delete':
          await softDelete(
            selected,
            type,
            setSelected,
            refreshUsers
          );
          break;
        case 'restore':
          await restore(
            selected,
            type,
            setSelected,
            refreshUsers
          );
          break;
        case 'hard-delete':
          await hardDelete(
            selected,
            type,
            setSelected,
            refreshUsers
          );
          break;
        case 'grant-admin':
          await grantAdmin(selected, setSelected, refreshUsers);
          break;
        case 'revoke-admin':
          await revokeAdmin(selected, setSelected, refreshUsers);
          break;
        default:
          break;
      }
    };

    runBulkAction();
  }, [bulkAction]);

  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

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
        handleDelete={handleSoftDelete}
        handleRestore={handleRestore}
        hardDelete={handleHardDelete}
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
          { name: 'Grant admin', _id: 'grant-admin' },
          { name: 'Revoke admin', _id: 'revoke-admin' },

          ...(deletedFilter
            ? [
                { name: 'Restore selected', _id: 'restore' },
                { name: 'Delete permanently', _id: 'hard-delete', color: 'red' },
              ]
            : [
                { name: 'Delete Selected', _id: 'delete', color: 'red' },
              ]),
        ]}
      />
    </MainLayout>
  );
};

export default UsersList;