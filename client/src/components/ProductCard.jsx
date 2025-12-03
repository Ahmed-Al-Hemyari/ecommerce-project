import React from 'react'
import defaultProductImage from '@/assets/default-product-image.png'

const ProductCard = ({product}) => {
  return (
    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative">
            <img src={product.img ?? defaultProductImage} alt={product.title} className="w-full h-48 object-cover" />
        </div>
        <div className="p-4">
            <div className="font-medium text-sm" style={{ color: 'var(--color-dark-gray)' }}>{product.title}</div>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-lg font-bold">${product.price}</div>
                <button className="px-3 py-1 rounded-md bg-(--color-green) text-sm cursor-pointer">Add</button>
            </div>
        </div>
    </div>
  )
}

export default ProductCard