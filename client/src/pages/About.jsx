import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import MainLayout from '../layouts/MainLayout'
import { Link } from 'react-router-dom'
import mission from '@/assets/mission.png'
import { useSnackbar } from 'notistack'

const About = () => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
      if(location.state?.message)
      {
        enqueueSnackbar(location.state.message, {variant: location.state.status});
      }
    }, [location.state])


  return (
    <MainLayout page="about">
      {/* Hero */}
      <section className="max-w-7xl mx-auto p-6 text-center">
        <h2 className="text-4xl font-extrabold">About QuickBuy</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Making online shopping faster, simpler, and more enjoyable for everyone.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto py-6 px-4 grid md:grid-cols-2 gap-10 items-center">
        <img src={mission} alt="Mission" className="rounded-xl w-36 mx-auto" />
        <div>
          <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed text-justify">
            At QuickBuy, our mission is to provide a seamless shopping experience that saves you time and effort.
            We focus on fast delivery, verified quality, and the best deals online — all wrapped in a smooth interface
            designed to help you find what you need instantly.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-7xl mx-auto p-6 text-center">
        <h3 className="text-2xl font-semibold mb-6">What We Offer</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-semibold mb-2">Fast Delivery</h4>
            <p className="text-gray-600 text-sm">Receive your products quickly with our optimized delivery system.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">💳</div>
            <h4 className="font-semibold mb-2">Secure Payments</h4>
            <p className="text-gray-600 text-sm">Checkout safely using multiple secure payment methods.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-600 text-sm">Our team is always ready to help you with any queries.</p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto p-6 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to Shop?</h3>
        <p className="text-gray-600 mb-6">Join QuickBuy today and enjoy fast, secure, and smart shopping.</p>
        <Link to={'/products'} className="px-6 py-3 rounded-md bg-(--color-green) text-(--color-dark-gray) font-semibold shadow-md">Shop Now</Link>
      </section>
    </MainLayout>
  )
}

export default About