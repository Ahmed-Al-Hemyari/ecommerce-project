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
  const [payedFilter, setPayedFilter] = useState(null);
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

  const headers = [
    { label: 'User', field: 'user', type: 'link', link: 'users' },
    { label: 'Status', field: 'status', type: 'status' },
    { label: 'Payed', field: 'payed', type: 'bool' },
    { label: 'Total Price', field: 'totalAmount', type: 'price' },
  ];

  const bulkActions = [
    { _id: 'pending', name: 'Mark as Pending' },
    { _id: 'processing', name: 'Mark as Processing' },
    { _id: 'shipped', name: 'Mark as Shipped' },
    { _id: 'delivered', name: 'Mark as Delivered' },

    { _id: 'divider' },

    { _id: 'payed', name: 'Mark as Paid' },
    { _id: 'not-payed', name: 'Mark as Unpaid' },

    { _id: 'divider' },

    { _id: 'cancelled', name: 'Cancel Orders', color: 'red' },
    { _id: 'delete', name: 'Delete Orders', color: 'red' },
  ];

  const getOrders = async (search, user, product, status, payed, currentPage, limit) => {
    try {
      const response = await orderService.getOrders({search, user, product, status, payed, page: currentPage, limit});
      setOrders(response.data.orders);
      console.log(response.data.orders);
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
    getOrders(search, userFilter, productFilter, statusFilter, payedFilter, currentPage, limit);

  // Fetch orders when search/filter changes
  useEffect(() => {
    setLoading(true);
    refreshOrders();
  }, [search, userFilter, productFilter, statusFilter, payedFilter, currentPage, limit]);

  // Bulk actions useEffect
  useEffect(() => {
    if (!bulkAction || selected.length === 0) return;

    const runBulkAction = async () => {
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
          case 'payed':
            await orderService.updateToPayed(selected);
            break;
          case 'not-payed':
            await orderService.updateToNotPayed(selected);
            break;
          case 'delete':
            await hardDelete(
              selected,
              type,
              setSelected,
              refreshOrders
            );
            break;
          default:
            return;
        }

        enqueueSnackbar('Orders updated successfully', { variant: 'success' });
        setSelected([]);
        setBulkAction('');
        refreshOrders();
      } catch (err) {
        enqueueSnackbar('Bulk update failed', { variant: 'error' });
        console.error(err);
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
            'hard-delete', 'cancel', 'edit', 'show'
          ]}
        // bulk
        bulk={{ selected, setSelected, bulkActions, bulkAction, setBulkAction }}
      />
    </MainLayout>
  );
};

export default OrdersList;