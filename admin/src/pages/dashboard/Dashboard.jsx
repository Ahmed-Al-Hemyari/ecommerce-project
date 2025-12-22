import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout';
import dashboardService from '@/services/dashboardService';
import { enqueueSnackbar } from 'notistack';
import StatsGrid from '@/components/dashboard/StatsGrid';
import SalesLineChart from '@/components/dashboard/SalesLineChart';
import Spinner from '@/components/UI/Spinner';
import OrderStatusChart from '@/components/dashboard/OrderStatusChart';
import DataTable from '@/components/UI/Tables/DataTable';

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
    console.log(data)
  }, [])
  return (
    <MainLayout>
      { loading ? (
        <Spinner/>
      ) : (
        <>
          <h2
            className="text-2xl md:text-3xl font-extrabold leading-tight text-(--color-dark-gray)"
          >
            Welcome Back, {' '}
            <span className='text-(--color-green)'>{user.name}</span>
          </h2>
          <div className="pl-4 mt-10">
            <h2
              className="text-xl md:text-2xl font-extrabold leading-tight text-(--color-dark-gray)"
            >
              Stats
            </h2>
            <div className="h-10"/>
            <StatsGrid stats={data?.stats}/>
            <div className="h-10"/>
            <h2
              className="text-xl md:text-2xl font-extrabold leading-tight text-(--color-dark-gray)"
            >
              Sales
            </h2>
            <div className="h-10"/>
            <SalesLineChart salesByDay={data.salesByDay} />
            <div className="h-20"/>
            <h2
              className="text-xl md:text-2xl font-extrabold leading-tight text-(--color-dark-gray)"
            >
              Orders Status
            </h2>
            <OrderStatusChart orderStatus={data.orderStatus}/>
            <div className="h-10"/>
            <h2
              className="text-xl md:text-2xl font-extrabold leading-tight text-(--color-dark-gray)"
            >
              Recent Orders
            </h2>
            <DataTable
              headers={[
                { label: 'User', field: 'user', type: 'link', link: 'users' },
                { label: 'Status', field: 'status', type: 'status' },
                { label: 'Payed', field: 'payed', type: 'bool' },
                { label: 'Total Price', field: 'totalAmount', type: 'price' },
              ]}
              data={data.recentOrders}
              loading={loading}
              customize={{showActions: false, showHeader: false, showPagination: false, showSelect: false}}
            />
            <div className="h-20"/>
            <h2
              className="text-xl md:text-2xl font-extrabold leading-tight text-(--color-dark-gray)"
            >
              Low Stock Products
            </h2>
            <DataTable
              headers={[
                { label: 'Name', field: 'name', type: 'string' },
                { label: 'Category', field: 'category', type: 'link', link: 'categories' },
                { label: 'Brand', field: 'brand', type: 'link', link: 'brands' },
                { label: 'Stock', field: 'stock', type: 'string' },
                { label: 'Price', field: 'price', type: 'price' },
              ]}
              data={data.lowStockProducts}
              loading={loading}
              customize={{showActions: false, showHeader: false, showPagination: false, showSelect: false}}
            />
          </div>
        </>
      )}
    </MainLayout>
  )
}

export default Dashboard