import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ user }) => {
  return (
    <section className="max-w-7xl mx-auto p-6 text-center md:text-left">
      <div>
        <h2
          className="text-4xl md:text-5xl font-extrabold leading-tight"
          style={{ color: 'var(--color-dark-gray)' }}
        >
          Shop Smarter.{' '}
          <span style={{ color: 'var(--color-green)' }}>Shop Faster.</span>
        </h2>

        <p className="mt-4 text-gray-600 max-w-xl mx-auto md:mx-0">
          Find great deals, fast delivery and trusted quality. <br /> QuickBuy makes online
          shopping effortless.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            to="/products"
            className="px-6 py-3 rounded-md bg-(--color-green) font-semibold shadow-md"
          >
            {user ? 'Continue Shopping' : 'Shop Now'}
          </Link>

          {user && (
            <Link
              to="/profile"
              className="px-6 py-3 rounded-md border font-semibold"
            >
              My Account
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
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
    </section>
  );
};

export default Hero;
