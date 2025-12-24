import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import orderService from '@/services/orderService';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import OrderItemCard from '@/components/UI/OrderItemCard';
import Spinner from '@/components/UI/Spinner';

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load order", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async () => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Order',
        text: 'Are you sure you want to cancel this order?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel it',
        confirmButtonColor: '#dd2222',

        // 🔥 Loading handling
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            await orderService.updateToCancelled([id]);
          } catch (error) {
            Swal.showValidationMessage('Failed to cancel order');
          }
        }
      });

      if (result.isConfirmed) {
        navigate('/orders', {
          state: {
            message: 'Order cancelled successfully',
            status: 'success'
          }
        });
      }
    } catch (error) {
      enqueueSnackbar('Failed to cancel order', { variant: 'error' });
    }
  };


  const onHardDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Delete Order Permanently',
        text: 'Are you sure you want to delete this order permanently?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d50101',

        // 🔥 Loading handling
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            await orderService.hardDelete([id]);
          } catch (error) {
            Swal.showValidationMessage('Failed to delete order permanently');
          }
        }
      });

      if (result.isConfirmed) {
        navigate('/orders', {
          state: {
            message: 'Order deleted successfully',
            status: 'success'
          }
        });
      }

    } catch (error) {
      enqueueSnackbar('Failed to delete order', { variant: 'error' });
      console.error(error);
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
      {loading ? <Spinner/> : (
        <div>
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
        </div>
      )}
    </MainLayout>
  );
};

export default ShowOrder;