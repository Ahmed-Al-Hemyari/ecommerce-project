import React from 'react'
import { Button } from '@/components/UI/button'
import Navbar from '@/components/Layouts/Navbar'
import MainLayout from '@/components/Layouts/MainLayout';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <MainLayout>
      <h2
        className="text-4xl md:text-5xl font-extrabold leading-tight"
        style={{ color: 'var(--color-dark-gray)' }}
      >
        Shop Smarter.{' '} <br />
        <span style={{ color: 'var(--color-green)' }}>Shop Faster.</span>
      </h2>
    </MainLayout>
  )
}

export default Dashboard