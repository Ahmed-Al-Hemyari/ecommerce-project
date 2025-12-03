import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '@/assets/hero-image-1.png'

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: 'var(--color-dark-gray)' }}>
          Shop Smarter. <span style={{ color: 'var(--color-green)' }}>Shop Faster.</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl">Find great deals, fast delivery and trusted quality. QuickBuy makes online shopping effortless.</p>


          <div className="mt-6 flex gap-4">
            <Link to={'/products'} className="px-6 py-3 rounded-md bg-(--color-green) font-semibold shadow-md">Shop Now</Link>
            {/* <Link to={'/categories'} className="px-6 py-3 rounded-md border">Browse Categories</Link> */}
          </div>


            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl">🚚</div>
                <div className="text-sm font-medium">Fast Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">💳</div>
                <div className="text-sm font-medium">Secure Payments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">💬</div>
                <div className="text-sm font-medium">24/7 Support</div>
              </div>
            </div>
        </div>


        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden bg-white">
            <img src={heroImage} alt="Hero product" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>
  )
}

export default Hero