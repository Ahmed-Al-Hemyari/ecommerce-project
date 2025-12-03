import React from 'react'
import logo from "@/assets/quickbuylogo.svg";
import { Link } from 'react-router-dom';
import AuthLayout from "@/layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
        {/* Logo */}
        <img
            src={logo}
            alt="QuickBuy logo"
            className="w-40 mx-auto mb-6 object-contain drop-shadow"
        />

        <p className="text-center text-gray-600 mb-8">Welcome back! Log in to continue.</p>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2 rounded-lg border border-(--color-light-gray) focus:outline-none focus:ring-2 focus:ring-(--color-green)"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-(--color-light-gray) focus:outline-none focus:ring-2 focus:ring-(--color-green)"
            />
          </div>

          {/* <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              Remember me
            </label>
            <button type="button" className="text-(--color-green) hover:underline">
              Forgot password?
            </button>
          </div> */}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-(--color-green) text-(--color-dark-gray) font-semibold hover:opacity-90"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow border-b border-(--color-light-gray)"></div>
          <span className="mx-2 text-gray-500">or</span>
          <div className="grow border-b border-(--color-light-gray)"></div>
        </div>

        <Link to={'/'}>
            <button className="w-full py-3 rounded-lg border border-(--color-dark-gray) font-medium hover:bg-gray-100">
              Continue as Guest
            </button>
        </Link> 

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{' '}
          <Link to={'/register'} className="text-(--color-green) font-semibold hover:underline">Sign up</Link>
        </p>
    </AuthLayout>
  )
}

export default Login