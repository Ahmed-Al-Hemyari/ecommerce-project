import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import orderService from '@/services/orderService';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';
import { handleCancel, hardDelete } from '@/utils/Functions';

const OrdersList = ({ propLimit = 50, inner = false, user, product }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Type 
  const type = 'Order';
  // Data
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  // Filters
  const [statusFilter, setStatusFilter] = useState(null);
  const [paidFilter, setPaidFilter] = useState(null);
  const [userFilter, setUserFilter] = useState(null);
  const [productFilter, setProductFilter] = useState(null);
  // Pagination
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(propLimit);
  // bulk
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const filters = [
    {
      label: 'Status',
      options: [
        { name: 'Draft', _id: 'draft' },
        { name: 'Pending', _id: 'pending' },
        { name: 'Processing', _id: 'processing' },
        { name: 'Shipped', _id: 'shipped' },
        { name: 'Delivered', _id: 'delivered' },
        { name: 'Cancelled', _id: 'cancelled' },
      ],
      placeholder: 'Choose Status',
      value: statusFilter,
      setValue: setStatusFilter,
    },
    {
      label: 'Paid',
      options: [
        { name: 'Paid', _id: true },
        { name: 'Not Paid', _id: false },
      ],
      placeholder: 'Choose...',
      value: paidFilter,
      setValue: setPaidFilter,
    },
  ];

  const headers = [
    { label: 'ID', field: '_id', type: 'string' },
    { label: 'User', field: 'user', type: 'link', link: 'users' },
    { label: 'Status', field: 'status', type: 'status' },
    { label: 'Paid', field: 'paid', type: 'bool' },
    { label: 'Paid At', field: 'paidAt', type: 'string' },
    { label: 'Total Price', field: 'total', type: 'price' },
  ];

  const bulkActions = [
    { _id: 'pending', name: 'Mark as Pending' },
    { _id: 'processing', name: 'Mark as Processing' },
    { _id: 'shipped', name: 'Mark as Shipped' },
    { _id: 'delivered', name: 'Mark as Delivered' },

    { _id: 'divider' },

    { _id: 'paid', name: 'Mark as Paid' },
    { _id: 'not-paid', name: 'Mark as Unpaid' },

    { _id: 'divider' },

    { _id: 'cancelled', name: 'Cancel Orders', color: 'red' },
    { _id: 'delete', name: 'Delete Orders', color: 'red' },
  ];

  const getOrders = async (search, user, product, status, paid, currentPage, limit) => {
    try {
      const response = await orderService.getOrders({search, user, product, status, paid, page: currentPage, limit});
      const formatted = response.data.orders.map(order => ({
        ...order,
        paidAt:
          order.paidAt ?
          new Date(order.paidAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : null,
      }));
      setOrders(formatted);
      console.log(formatted);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      enqueueSnackbar(error || 'Failed to load orders', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = () => 
    getOrders(search, userFilter, productFilter, statusFilter, paidFilter, currentPage, limit);

  // Fetch orders when search/filter changes
  useEffect(() => {
    setLoading(true);
    refreshOrders();
  }, [search, userFilter, productFilter, statusFilter, paidFilter, currentPage, limit]);

  // Bulk actions useEffect
  useEffect(() => {
    if (!bulkAction || selected.length === 0) return;

    const runBulkAction = async () => {
      const result = await Swal.fire({
        title: 'Confirm action',
        text: `Are you sure you want to apply "${bulkAction}" to ${selected.length} orders?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#1d7451',
      });

      if (!result.isConfirmed) {
        setBulkAction('');
        return;
      }

      // 🔄 Show loading modal
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while orders are being updated',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        switch (bulkAction) {
          case 'pending':
            await orderService.updateToPending(selected);
            break;
          case 'processing':
            await orderService.updateToProcessing(selected);
            break;
          case 'shipped':
            await orderService.updateToShipped(selected);
            break;
          case 'delivered':
            await orderService.updateToDelivered(selected);
            break;
          case 'cancelled':
            await orderService.updateToCancelled(selected);
            break;
          case 'paid':
            await orderService.updateToPaid(selected);
            break;
          case 'not-paid':
            await orderService.updateToNotPaid(selected);
            break;
          case 'delete':
            await hardDelete(selected, type, setSelected, refreshOrders);
            break;
          default:
            return;
        }

        Swal.fire({
          title: 'Success',
          text: 'Orders updated successfully',
          icon: 'success',
          confirmButtonColor: '#1d7451',
        });

        setSelected([]);
        setBulkAction('');
        refreshOrders();
      } catch (err) {
        console.error(err);

        Swal.fire({
          title: 'Error',
          text: 'Bulk update failed',
          icon: 'error',
          confirmButtonColor: '#d50101',
        });
      }
    };

    runBulkAction();
  }, [bulkAction]);


  // Initial useEffect
  useEffect(() => {
    if(user) setUserFilter(user._id);
    if(product) setProductFilter(product._id);
  }, [user, product]);


  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, { variant: location.state.status });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);



  return inner ? (
    <DataTable
      tableName='Orders'
      type='Order'
      headers={headers}
      link={'/orders'}
      data={orders}
      loading={loading}
      // Pagination
      pagination={{ currentPage, setCurrentPage, totalPages, totalItems, limit, setLimit }}
      filters={{ inputs: filters, search, setSearch}}
      // Refresh
      refreshData={refreshOrders}
      // Actions
      actions={[
          'hard-delete', 'cancel', 'edit', 'show'
        ]}
      // bulk
      bulk={{ selected, setSelected, bulkActions, bulkAction, setBulkAction }}
      // Customize
      customize={{ showTableName: true }}
    />
  ) : (
    <MainLayout>
      <DataTable
        tableName='Orders'
        type='Order'
        headers={headers}
        link={'/orders'}
        data={orders}
        loading={loading}
        // Pagination
        pagination={{ currentPage, setCurrentPage, totalPages, totalItems, limit, setLimit }}
        filters={{ inputs: filters, search, setSearch}}
        // Refresh
        refreshData={refreshOrders}
        // Actions
        actions={[
            'hard-delete', 'show'
          ]}
        // bulk
        bulk={{ selected, setSelected, bulkActions, bulkAction, setBulkAction }}
      />
    </MainLayout>
  );
};

export default OrdersList;