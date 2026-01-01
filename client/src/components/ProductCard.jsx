import React from 'react'
import defaultProductImage from '@/assets/default-product-image.png'
import {
  addToLocalStorage,
  readLocalStorageItem,
  updateLocalStorageItem
} from '@/services/LocalStorageFunctions';
import { enqueueSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
const url = import.meta.env.VITE_IMAGES_BACKEND_URL;

const ProductCard = ({product, onCartChange}) => {
  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      enqueueSnackbar("Out of Stock", { variant: 'error' });
      return;
    }

    const cart = readLocalStorageItem('cart') || [];
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      // Increment quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      updateLocalStorageItem('cart', updatedItem);
    } else {
      // Add new item
      const cartProduct = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image,
        quantity: 1,
      };
      addToLocalStorage('cart', cartProduct);
    }

    enqueueSnackbar('Added to cart', { variant: 'success' });
    onCartChange?.();
  };

  return (
    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* ✅ Clickable area */}
      <Link to={`/products/${product._id}`}>
        <div className="relative">
          <img
            src={product.image ? `${url}${product.image}` : defaultProductImage}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>

        <div className="p-4 pb-0">
          <div
            className="font-bold text-lg"
            style={{ color: 'var(--color-dark-gray)' }}
          >
            {product.name}
          </div>

          <div
            className="font-normal text-base"
            style={{ color: 'var(--color-dark-gray)' }}
          >
            {product.brand.name}
          </div>

          <p className="font-normal text-sm text-red-600 mt-2">
            {(product.stock <= 10 && product.stock !== 0) && 'Last 10 products'}
            {product.stock === 0 && 'Out of stock'}
          </p>
        </div>
      </Link>

      {/* ✅ Non-clickable area */}
      <div className="p-4 pt-2 flex items-center justify-between">
        <div className="text-lg font-bold">${product.price}</div>

        <button
          disabled={product.stock === 0}
          className={`px-3 py-1 rounded-md text-sm ${
            product.stock === 0
              ? 'bg-(--color-light-gray) cursor-not-allowed'
              : 'bg-(--color-green) cursor-pointer'
          }`}
          onClick={handleAddToCart}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default ProductCard