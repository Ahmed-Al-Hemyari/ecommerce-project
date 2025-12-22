import React, { useEffect } from 'react'
import Swal from 'sweetalert2';
import { enqueueSnackbar } from 'notistack'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import AppSidebar from './Sidebar';
import { Boxes, Home, Package, ShoppingCart, Tags, Users } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '../UI/sidebar';
import authService from '@/services/authService';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const sidebarItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Users",
            url: "/users",
            icon: Users,
        },
        {
            title: "Categories",
            url: "/categories",
            icon: Boxes,
        },
        {
            title: "Brands",
            url: "/brands",
            icon: Tags,
        },
        {
            title: "Products",
            url: "/products",
            icon: ShoppingCart,
        },
        {
            title: "Orders",
            url: "/orders",
            icon: Package,
        },
    ];

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Sure you want to log out?",
            icon: "question",
            showCloseButton: true,
            confirmButtonText: "Yes, log out!",
            showCancelButton: true,
            confirmButtonColor: "#82E2BB"
        });

        if (!result.isConfirmed) return;

        try {
            const response = await authService.logout();
        } catch (error) {
            enqueueSnackbar("Failed to logout", {
                variant: 'error'
            });
            return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login', {
            state: {
                message: "Logged out successfully",
                status: "success"
            }
        });
    };
  return (
    <div>
        <SidebarProvider>
            <AppSidebar items={sidebarItems}/>
            <main className='w-full p-5'>
                {/* <SidebarTrigger/> */}
                <div>
                    <Navbar user={user} logout={handleLogout}/>
                    <div className="text-gray-800 min-h-[calc(100vh-5rem)] pt-20">
                        {children}
                    </div>
                </div>
            </main>
        </SidebarProvider>
    </div>
  )
}

export default MainLayout