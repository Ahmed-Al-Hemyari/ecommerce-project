import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrdersList from '../orders/OrdersList';
import { ArrowLeft } from 'lucide-react';

const ShowUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  const getUser = async () => {
    try {
      const response = await userService.getUser(id);
      const formatted = {
        ...response.data,
        role: response.data.role.charAt(0).toUpperCase() + response.data.role.slice(1),
        createdAt: new Date(response.data.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
      setUser(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load user", { variant: 'error' });
    }
  }

  const edit = () => {
    navigate(`/users/update/${user._id}`);
  }

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
      { user && (
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
            onEdit={edit}
            backTo={'/users'}
          />
          <OrdersList propLimit={10} inner user={user._id}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowUser