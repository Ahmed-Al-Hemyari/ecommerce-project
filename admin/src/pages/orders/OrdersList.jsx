import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import orderService from '@/services/orderService';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';

const OrdersList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Data
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  // Filters
  const [statusFilter, setStatusFilter] = useState(null);
  const [payedFilter, setPayedFilter] = useState(null);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(50);

  const headers = [
    { label: 'User', field: 'userName', type: 'link', link: 'users' },
    { label: 'Status', field: 'status', type: 'status' },
    { label: 'Payed', field: 'payed', type: 'bool' },
    { label: 'Total Price', field: 'totalAmount', type: 'price' },
  ];

  const getOrders = async (search, status, payed, currentPage, limit) => {
    try {
      const response = await orderService.getOrders(search, status, payed, currentPage, limit);
      const formatted = response.data.orders.map(order => ({
        ...order,
        userName: order.user?.name || 'Deleted User',
      }));
      setOrders(formatted);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar('Failed to load orders', { variant: 'error' });
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Order',
      text: 'Are you sure you want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await orderService.deleteOrder(id);
      enqueueSnackbar('Order deleted successfully', { variant: 'success' });
      // Refresh orders after deletion
      const payedValue = payedFilter
        ? payedFilter === 'Payed'
          ? true
          : false
        : undefined;
      getOrders(search, statusFilter, payedValue);
    } catch (error) {
      enqueueSnackbar('Failed to delete order', { variant: 'error' });
      console.error(error);
    }
  };

  // Fetch orders when search/filter changes
  useEffect(() => {
    getOrders(search, statusFilter, payedFilter, currentPage, limit);
  }, [search, statusFilter, payedFilter, currentPage, limit]);


  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, { variant: location.state.status });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const filters = [
    {
      label: 'Status',
      options: [
        { name: 'Pending', _id: 'Pending' },
        { name: 'Processing', _id: 'Processing' },
        { name: 'Shipped', _id: 'Shipped' },
        { name: 'Delivered', _id: 'Delivered' },
        { name: 'Cancelled', _id: 'Cancelled' },
      ],
      placeholder: 'Choose Status',
      value: statusFilter,
      setValue: setStatusFilter,
    },
    {
      label: 'Payed',
      options: [
        { name: 'Payed', _id: true },
        { name: 'Not Payed', _id: false },
      ],
      placeholder: 'Choose...',
      value: payedFilter,
      setValue: setPayedFilter,
    },
  ];

  const handleResetFilters = () => {
    setStatusFilter(null);
    setPayedFilter(null);
    setSearch('');
  };

  return (
    <MainLayout>
      <DataTable
        headers={headers}
        link='/orders'
        data={orders}
        search={search}
        setSearch={setSearch}
        filters={filters}
        tableName='Orders'
        handleDelete={handleDelete}
        // handleResetFilters={handleResetFilters}
        // Pagination
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit} setLimit={setLimit}
      />
    </MainLayout>
  );
};

export default OrdersList;
