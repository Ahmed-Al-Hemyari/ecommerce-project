import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getOrders, cancelOrderById } from '../services/api-calls';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getOrders(user.id);
      setOrders(response);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle cancel click
  const handleCancel = async (orderId) => {
    try {
      await cancelOrderById(orderId);
      fetchOrders();
      enqueueSnackbar("Order cancelled successfully!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Failed to cancel order!", { variant: "error" });
    }
  };
  
  // Show snackbar if coming from another page
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, { variant: location.state.status });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, enqueueSnackbar, navigate]);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <MainLayout>
      <h3 className="text-2xl font-semibold m-4" style={{ color: 'var(--color-dark-gray)' }}>
        My Orders
      </h3>
      <div className="space-y-6 max-w-5xl mx-auto p-4">
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">You have no orders yet.</p>
            ) : (
                orders.map((o) => (
                <div
                    key={o._id}
                    className="bg-white rounded-2xl shadow-md p-6 border border-(--color-light-gray)/30 hover:shadow-lg transition"
                >
                    <OrderCard order={o} onCancel={handleCancel}/>
                </div>
                ))
            )}
      </div>

    </MainLayout>
  );
};

export default Orders;
