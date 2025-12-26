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
      console.log(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load order", { variant: 'error' });
    } finally {
      setLoading(false);
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
            title={`Order #${order.orderId || order._id}`}
            data={data}
            type={'Brand'}
            actions={[
                'ruplicate', 'edit', 'cancel', 'hard-delete' 
            ]}
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