import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import orderService from '@/services/orderService';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import OrderItemCard from '@/components/UI/OrderItemCard';

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

  const onCancel = async () => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Order',
        text: 'Sure you want to delete this order??',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel it',
        confirmButtonColor: '#dd2222'
      });

      if (!result.isConfirmed) return;
      
      const response = await orderService.updateToCancelled([id]);
      navigate('/orders', {
        state: {
          message: "Order deleted successfully",
          status: 'success'
        }
      })
    } catch (error) {
      enqueueSnackbar("Failed to cancel order");
    }
  }

  const onHardDelete = async () => {
    const result = Swal.fire({
      title: 'Delete Order Permenantly',
      text: 'Sure you want to delete this order permenantly??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d50101'
    })

    if (!(await result).isConfirmed) {
      return;
    }
    try {
      const response = await orderService.hardDelete([id]);
      enqueueSnackbar(response.data, {
        variant: 'success'
      });
      navigate('/orders', {
        state: {
          message: "Order deleted successfully",
          status: 'success'
        }
      })
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
      console.error(error);
    }
  }

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
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <ShowCard
        title={`Order #${order.orderId}`}
        data={data}
        onEdit
        onRuplicate
        onDelete={onHardDelete}
        onCancel={order.status === 'Cancelled' ? '' : onCancel}
        link={'/orders'}
      />

      <div className="h-6" />

      <ShowCard
        title="Shipping Information"
        data={shippingData}
      />

      <div className="h-6" />
      <h1 className="text-2xl font-semibold mb-2">Products</h1>
      {order.orderItems.map(item => (
        <OrderItemCard
          key={item._id}
          item={item}
        />
      ))}
      {/* <OrderItemCard/> */}

      {/* <ShowCard
        title="Order Items"
        data={itemsData}
      /> */}
    </MainLayout>
  );
};

export default ShowOrder;