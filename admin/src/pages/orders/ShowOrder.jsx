import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import orderService from '@/services/orderService';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const getOrder = async () => {
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load order", { variant: 'error' });
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  if (!order) return <MainLayout><p>Loading...</p></MainLayout>;

  // Prepare main details
  const data = [
    { label: 'User', value: order.user?.name || '-' },
    { label: 'Total Amount', value: `$${order.totalAmount}` },
    { label: 'Status', value: order.status },
    { label: 'Paid', value: order.payed ? 'Yes' : 'No' },
  ];

  const paymentMethod = {
    cod: 'Cash on Delivery',
    credit: 'Credit/Debit Card',
    paypal: 'PayPal',
  }

  // Shipping info
  const shippingData = [
    { label: 'Address 1', value: order.shipping?.address1 || '-' },
    { label: 'Address 2', value: order.shipping?.address2 || '-' },
    { label: 'City', value: order.shipping?.city || '-' },
    { label: 'ZIP', value: order.shipping?.zip || '-' },
    { label: 'Country', value: order.shipping?.country || '-' },
    { label: 'Payment Method', value: paymentMethod[order.shipping?.paymentMethod] || '-' },
  ];

  // Order items as nested data
  const itemsData = order.orderItems?.map(item => ({
    label: `${item.product?.name || 'Unknown'} (x${item.quantity})`,
    value: `$${item.price * item.quantity}`
  })) || [];

  return (
    <MainLayout>
      <ShowCard
        title={`Order #${order.orderId}`}
        data={data}
        backTo="/orders"
        onEdit={() => navigate(`/orders/update/${order._id}`)}
      />

      <div className="h-6" />

      <ShowCard
        title="Shipping Information"
        data={shippingData}
      />

      <div className="h-6" />

      <ShowCard
        title="Order Items"
        data={itemsData}
      />
    </MainLayout>
  );
};

export default ShowOrder;