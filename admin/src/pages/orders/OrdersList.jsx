import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import orderService from '@/services/orderService';
import DataTable from '@/components/DataTable';

const OrdersList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const headers = [
    // 'Title', 'Category', 'Brand', 'Price'
    { label: 'User', field: 'userName' },
    { label: 'Status', field: 'status' },
    { label: 'Payed', field: 'payed' },
    { label: 'Total Price', field: 'totalAmount' },
  ];

  const getProducts = async () => {
    try {
      const response = await orderService.getOrders();
      const formatted = response.data.map(order => ({
        ...order,
        userName: String(order.user?.name) || 'Deleted User',
      }));
      console.log(response.data);
      setOrders(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load products", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getProducts();
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
      />
    </MainLayout>
  )
}

export default OrdersList