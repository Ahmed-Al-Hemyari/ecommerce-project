import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import orderService from '@/services/orderService';
import DataTable from '@/components/UI/Tables/DataTable';
import Swal from 'sweetalert2';

const OrdersList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const headers = [
    // 'Title', 'Category', 'Brand', 'Price'
    { label: 'User', field: 'userName', type: 'link', link: 'users'},
    { label: 'Status', field: 'status', type: 'status' },
    { label: 'Payed', field: 'payed', type: 'bool' },
    { label: 'Total Price', field: 'totalAmount', type: 'price' },
  ];

  const getOrders = async () => {
    try {
      const response = await orderService.getOrders();
      const formatted = response.data.map(order => ({
        ...order,
        userName: String(order.user?.name) || 'Deleted User',
      }));
      console.log(response.data);
      setOrders(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load orders", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    const result = Swal.fire({
      title: 'Delete Order',
      text: 'Sure you want to delete this order??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await orderService.deleteOrder(id);
      enqueueSnackbar("Order deleted successfully", {
        variant: 'success'
      });
      getOrders();
    } catch (error) {
      enqueueSnackbar("Failed to delete order", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getOrders();
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
        link='/orders'
        data={orders}
        tableName='Orders Table'
        handleDelete={handleDelete}
      />
    </MainLayout>
  )
}

export default OrdersList