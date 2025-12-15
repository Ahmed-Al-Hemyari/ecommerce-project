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
  // Loading
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(50);

  const headers = [
    { label: 'User', field: 'user', type: 'link', link: 'users' },
    { label: 'Status', field: 'status', type: 'status' },
    { label: 'Payed', field: 'payed', type: 'bool' },
    { label: 'Total Price', field: 'totalAmount', type: 'price' },
  ];

  const getOrders = async (search, status, payed, currentPage, limit) => {
    setLoading(true);
    try {
      const response = await orderService.getOrders(search, status, payed, currentPage, limit);
      const formatted = response.data.orders.map(order => ({
        ...order,
        user: order.user
          ? { _id: order.user._id, name: order.user.name }
          : null,
      }));
      setOrders(formatted);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar('Failed to load orders', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Order',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      confirmButtonColor: '#d50101',
    });

    if (!result.isConfirmed) return;

    try {
      await orderService.cancelOrder(id);
      enqueueSnackbar('Order cancelled successfully', { variant: 'success' });
      // Refresh orders after deletion
      const payedValue = payedFilter
        ? payedFilter === 'Payed'
          ? true
          : false
        : undefined;
      getOrders(search, statusFilter, payedValue);
    } catch (error) {
      enqueueSnackbar('Failed to delete order', { variant: 'error' });
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
        handleCancel={handleCancel}
        // Loading
        loading={loading}
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
