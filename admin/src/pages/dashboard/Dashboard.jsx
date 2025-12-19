import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout';
import dashboardService from '@/services/dashboardService';
import { enqueueSnackbar } from 'notistack';
import StatsGrid from '@/components/dashboard/StatsGrid';
import SalesLineChart from '@/components/dashboard/SalesLineChart';
import Spinner from '@/components/UI/Spinner';
import OrderStatusChart from '@/components/dashboard/OrderStatusChart';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // const [stats, setStats] = useState([]);
  // const [salesByDay, setSalesByDay] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setData(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to load data", {
        variant: 'error'
      })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
    // console.log(data?.stats)
  }, [])
  return (
    <MainLayout>
      { loading ? (
        <Spinner/>
      ) : (
        <>
          <h2
            className="text-2xl md:text-3xl font-extrabold leading-tight"
            style={{ color: 'var(--color-dark-gray)' }}
          >
            Welcome Back, {' '}
            <span style={{ color: 'var(--color-green)' }}>{user.name}</span>
          </h2>
          <div className="pl-4 mt-10">
            <StatsGrid stats={data?.stats}/>
            <div className="h-20"/>
            <SalesLineChart salesByDay={data.salesByDay} />
            <div className="h-20"/>
            <OrderStatusChart orderStatus={data.orderStatus}/>
          </div>
        </>
      )}
    </MainLayout>
  )
}

export default Dashboard