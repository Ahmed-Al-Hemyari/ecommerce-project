import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-(--color-dark-gray)">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            {children}
        </div>
    </div>
  )
}

export default AuthLayout