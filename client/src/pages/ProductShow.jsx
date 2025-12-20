import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { productService } from '../services/api-calls.js';
import Spinner from '../components/Spinner';
import { readLocalStorageItem, addToLocalStorage, updateLocalStorageItem } from '../services/LocalStorageFunctions.js';
import MainLayout from '../layouts/MainLayout.jsx';
import GoToCartButton from '../components/GoToCartButton';
import defaultProductImage from '@/assets/default-product-image.png'

const ProductShow = ({ onCartChange }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getProduct(id);
        setProduct(response.data);
      } catch (error) {
        enqueueSnackbar('Failed to load product', { variant: 'error' });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const checkCart = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };

  useEffect(() => {
    checkCart();
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    const storageItems = readLocalStorageItem('cart') || [];
    const existingItem = storageItems.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
      updateLocalStorageItem('cart', existingItem);
    } else {
      const cartProduct = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image,
        quantity,
      };
      addToLocalStorage('cart', cartProduct);
    }

    enqueueSnackbar('Added to cart', { variant: 'success' });
    checkCart();
    if (onCartChange) onCartChange();
  };

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) return <div className="text-center mt-10 text-(--color-dark-gray)">Product not found</div>;

  return (
    <MainLayout page={'products'}>
      {!isCartEmpty && <GoToCartButton />}

      <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        {/* Product Image */}
        <img
          src={product.image ? `${import.meta.env.VITE_IMAGES_BACKEND_URL}${product.image}` : defaultProductImage}
          alt={product.name}
          className="w-full h-auto rounded-lg object-cover mb-6"
        />

        {/* Product Info */}
        <h1 className="text-2xl font-bold mb-2 text-(--color-dark-gray)">{product.name}</h1>

        <div className="flex flex-wrap gap-2 mb-3">
          {product.brand?.name && (
            <span className="px-3 py-1 rounded-full text-sm bg-(--color-light-gray) text-(--color-dark-gray)">
              {product.brand.name}
            </span>
          )}
          {product.category?.name && (
            <span className="px-3 py-1 rounded-full text-sm bg-(--color-light-gray) text-(--color-dark-gray)">
              {product.category.name}
            </span>
          )}
        </div>

        <p className="font-normal text-base text-red-600 my-2">
          {(product.stock <= 10 && product.stock !== 0) && 'Last 10 products'}
          {product.stock === 0 && 'Out of stock'}
        </p>

        <p className="text-xl font-semibold mb-4 text-(--color-dark-green)">${product.price}</p>
        <p className="text-(--color-dark-gray) mb-6">{product.description || 'No description available.'}</p>

        {/* Quantity Selector */}
        <div className={`flex items-center gap-3 mb-4 ${
          product.stock === 0 ? 'hidden' : 'flex'
        }`}>
          <button
            className="px-4 py-2 rounded hover:bg-(--color-light-gray) transition text-(--color-dark-gray)"
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 text-center border border-(--color-light-gray) rounded outline-none"
          />
          <button
            className="px-4 py-2 rounded hover:bg-(--color-light-gray) transition text-(--color-dark-gray)"
            onClick={() => setQuantity(prev => prev + 1)}
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 rounded font-semibold bg-(--color-dark-green) 
          text-white transition hover:bg-(--color-green) 
            ${
              product.stock === 0
              ? 'bg-(--color-light-gray) cursor-not-allowed'
              : 'bg-(--color-dark-green) cursor-pointer'
            }
          `}
        >
          Add to Cart
        </button>
      </div>
    </MainLayout>
  );
};

export default ProductShow;
