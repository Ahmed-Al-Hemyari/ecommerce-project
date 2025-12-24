import MainLayout from '@/components/Layouts/MainLayout';
import ShowCard from '@/components/UI/ShowCard';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrdersList from '../orders/OrdersList';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import Spinner from '@/components/UI/Spinner';

const ShowUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }
  
  const onAction = async () => {
    const deleted = user.deleted;

    try {
      const result = await Swal.fire({
        title: deleted ? 'Restore User' : 'Delete User',
        text: `Sure you want to ${deleted ? 'restore' : 'delete'} this user?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${deleted ? 'restore' : 'delete'} it`,
        confirmButtonColor: deleted ? '#1d7451' : '#d50101',

        // 🔥 Loading handling
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            if (deleted) {
              await userService.restore([id]);
            } else {
              await userService.softDelete([id]);
            }
          } catch (error) {
            Swal.showValidationMessage(
              `Failed to ${deleted ? 'restore' : 'delete'} user`
            );
          }
        }
      });

      if (result.isConfirmed) {
        navigate('/users', {
          state: {
            message: `User ${deleted ? 'restored' : 'deleted'} successfully`,
            status: 'success'
          }
        });
      }

    } catch (error) {
      enqueueSnackbar(
        `Failed to ${deleted ? 'restore' : 'delete'} user`,
        { variant: 'error' }
      );
    }
  };


  const onHardDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Delete User Permanently',
        text: 'Are you sure you want to delete this user permanently?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d50101',

        // 🔥 Loading handling
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            await userService.hardDelete([id]);
          } catch (error) {
            Swal.showValidationMessage('Failed to delete user permanently');
          }
        }
      });

      if (result.isConfirmed) {
        navigate('/users', {
          state: {
            message: 'User deleted successfully',
            status: 'success'
          }
        });
      }

    } catch (error) {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
      console.error(error);
    }
  };


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
            onEdit={true}
            onRuplicate={true}
            onDelete={!user.deleted ? onAction : null}
            onRestore={user.deleted ? onAction : null}
            onHardDelete={onHardDelete}
            deleted={user.deleted}
            link={'/users'}
          />
          <OrdersList propLimit={10} inner user={user}/>
        </>
      )}
    </MainLayout>
  )
}

export default ShowUser