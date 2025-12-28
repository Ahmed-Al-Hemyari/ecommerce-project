import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrdersList from '../orders/OrdersList';
import { ArrowLeft } from 'lucide-react';
import Spinner from '@/components/UI/Spinner';
import ShippingsList from '../shippings/ShippingsList';

const ShowUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await userService.getUser(id);
      console.log(response.data);
      const formatted = {
        ...response.data.user,
        role: response.data.user.role.charAt(0).toUpperCase() + response.data.user.role.slice(1),
        createdAt: new Date(response.data.user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
      setUser(formatted);
    } catch (error) {
      enqueueSnackbar(error || "Failed to load user", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const refreshUser = () => 
    getUser();

  useEffect(() => {
    getUser();
  }, []);

  const data = [
    {
      label: 'Name',
      value: user.name
    },
    {
      label: 'Role',
      value: user.role
    },
    {
      label: 'Email',
      value: user.email
    },
    {
      label: 'Phone',
      value: user.phone
    },
    {
      label: 'Created',
      value: user.createdAt
    },
  ];

  return (
    <MainLayout>
      { loading ? <Spinner/> : (
        <>
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-1 mb-3 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <ShowCard
              title={`${user.name} Details`}
              data={data}
              type={'Category'}
              actions={
                user.deleted ? [
                  'edit', 'restore', 'hard-delete' 
                ] : [
                  'ruplicate', 'edit', 'soft-delete'
                ]
              }
              deleted={user.deleted}
              link={'/users'}
            />
            <div className="h-4"></div>
            <ShippingsList shippings={user.shippings} loading={loading} refreshData={refreshUser}/>
          {/* <OrdersList propLimit={10} inner user={user}/> */}
        </>
      )}
    </MainLayout>
  )
}

export default ShowUser