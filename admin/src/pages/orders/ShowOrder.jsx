import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import orderService from '@/services/orderService';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { ArrowLeft } from 'lucide-react';
import OrderItemCard from '@/components/UI/OrderItemCard';
import Spinner from '@/components/UI/Spinner';
import OrderItemsList from '../orderItems/OrderItemsList';

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrder(id);
      console.log(response.data.order)
      setOrder(response.data.order);
    } catch (error) {
      enqueueSnackbar(error || "Failed to load order", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const refreshOrder = () => 
    getOrder();
  
  useEffect(() => {
    getOrder();
  }, [id]);

  if (!order) return <MainLayout><Spinner/></MainLayout>;

  const paymentMethod = {
    cod: 'Cash on Delivery',
    credit: 'Credit/Debit Card',
    paypal: 'PayPal',
  }

  const actions = ['ruplicate'];
  switch (order.status) {
    case 'draft':
      actions.push('submit-order', 'edit', 'hard-delete');
      break;
    case 'pending':
      actions.push('mark-paid', 'cancel');
      break;
    case 'cancelled':
      actions.push('hard-delete');
      break;
  }

  // Prepare main details
  const data = [
    { label: 'User', value: order.user?.name || '-' },
    { label: 'Subtotal', value: `$${order.subtotal}` },
    { label: 'Shipping Cost', value: `$${order.shippingCost}` },
    { label: 'Total Amount', value: `$${order.total}` },
    { label: 'Status', value: order.status.charAt(0).toUpperCase() + order.status.slice(1) },
    { label: 'Payment Method', value: paymentMethod[order.paymentMethod] || '-' },
    { label: 'Paid', value: order.paid ? 'Yes' : 'No' },
    { label: 'Paid At', value: order.paidAt ? new Date(order.paidAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : '-' },
  ];

  // Shipping info
  const shippingData = [
    { label: 'Address 1', value: order.shipping?.address1 || '-' },
    { label: 'Address 2', value: order.shipping?.address2 || '-' },
    { label: 'City', value: order.shipping?.city || '-' },
    { label: 'ZIP', value: order.shipping?.zip || '-' },
    { label: 'Country', value: order.shipping?.country || '-' },
  ];

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
            type={'Order'}
            actions={actions}
            link={'/orders'}
          />

          <div className="h-6" />

          <ShowCard
            title="Shipping Information"
            data={shippingData}
          />

          <div className="h-6" />
          <OrderItemsList
            orderItems={order.orderItems}
            refreshData={refreshOrder}
            loading={loading}
            order={order}
            draft={order.status === 'draft' ? true : false}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default ShowOrder;