import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import orderService from '@/services/orderService';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';

const OrdersList = ({ propLimit = 50, inner = false, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data & Filters
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [payedFilter, setPayedFilter] = useState(null);
  const userFilter = inner ? user : undefined;

  // Loading & Pagination
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(propLimit);

  // Bulk
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const headers = [
    { label: 'User', field: 'user', type: 'link', link: 'users' },
    { label: 'Status', field: 'status', type: 'status' },
    { label: 'Payed', field: 'payed', type: 'bool' },
    { label: 'Total Price', field: 'totalAmount', type: 'price' },
  ];

  // -----------------------------
  // Fetch Orders
  // -----------------------------
  const getOrders = async (search, user, status, payed, page, limit) => {
    setLoading(true);
    try {
      const response = await orderService.getOrders(
        search,
        user,
        status,
        payed,
        page,
        limit
      );

      const formatted = response.data.orders.map(order => ({
        ...order,
        user: order.user ? { _id: order.user._id, name: order.user.name } : null,
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

  // -----------------------------
  // Cancel Single Order
  // -----------------------------
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
      await orderService.updateToCancelled([id]);
      enqueueSnackbar('Order cancelled successfully', { variant: 'success' });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Failed to cancel order', { variant: 'error' });
    }
  };

  // -----------------------------
  // Bulk Actions
  // -----------------------------
  const bulkUpdate = async (type) => {
    if (!selected.length) return;

    const actionNames = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      payed: 'Payed',
      'not-payed': 'Not Payed',
    };

    const result = await Swal.fire({
      title: 'Update Orders',
      text: `Are you sure you want to update ${selected.length} orders to ${actionNames[type]}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update them',
      confirmButtonColor: '#1d7451',
    });

    if (!result.isConfirmed) return;

    try {
      switch (type) {
        case 'pending':
          await orderService.updateToPending(selected); break;
        case 'processing':
          await orderService.updateToProcessing(selected); break;
        case 'shipped':
          await orderService.updateToShipped(selected); break;
        case 'delivered':
          await orderService.updateToDelivered(selected); break;
        case 'cancelled':
          await orderService.updateToCancelled(selected); break;
        case 'payed':
          await orderService.updateToPayed(selected); break;
        case 'not-payed':
          await orderService.updateToNotPayed(selected); break;
        default: return;
      }
      enqueueSnackbar('Orders updated successfully', { variant: 'success' });
      setSelected([]);
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Failed to update orders', { variant: 'error' });
      console.error(error);
    }
  };

  // -----------------------------
  // Fetch Orders Helper
  // -----------------------------
  const fetchOrders = () => {
    const normalizedStatus = statusFilter ?? undefined;
    const normalizedPayed = payedFilter ?? undefined;

    getOrders(search, userFilter, normalizedStatus, normalizedPayed, currentPage, limit);
  };

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    fetchOrders();
  }, [search, userFilter, statusFilter, payedFilter, currentPage, limit]);

  useEffect(() => {
    if (!bulkAction) return;
    bulkUpdate(bulkAction);
    setBulkAction('');
  }, [bulkAction]);

  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, { variant: location.state.status });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // -----------------------------
  // Filters
  // -----------------------------
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

  // -----------------------------
  // Render
  // -----------------------------
  return inner ? (
    <DataTable
      headers={headers}
      link='/orders'
      data={orders}
      search={search}
      setSearch={setSearch}
      filters={filters}
      tableName='Orders'
      handleCancel={handleCancel}
      loading={loading}
      currentPage={currentPage} setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      limit={limit} setLimit={setLimit}
      selected={selected} setSelected={setSelected}
      setBulkAction={setBulkAction}
      inner
      bulkActions={[
        { name: 'Update to Pending', _id: 'pending'},
        { name: 'Update to Processing', _id: 'processing'},
        { name: 'Update to Shipped', _id: 'shipped'},
        { name: 'Update to Delivered', _id: 'delivered'},
        { name: 'Update to Cancelled', _id: 'cancelled'},
        { name: 'Update to Payed', _id: 'payed'},
        { name: 'Update to Not Payed', _id: 'not-payed'},
      ]}
    />
  ) : (
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
        loading={loading}
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit} setLimit={setLimit}
        selected={selected} setSelected={setSelected}
        setBulkAction={setBulkAction}
        bulkActions={[
          { name: 'Update to Pending', _id: 'pending'},
          { name: 'Update to Processing', _id: 'processing'},
          { name: 'Update to Shipped', _id: 'shipped'},
          { name: 'Update to Delivered', _id: 'delivered'},
          { name: 'Update to Cancelled', _id: 'cancelled'},
          { name: 'Update to Payed', _id: 'payed'},
          { name: 'Update to Not Payed', _id: 'not-payed'},
        ]}
      />
    </MainLayout>
  );
};

export default OrdersList;
