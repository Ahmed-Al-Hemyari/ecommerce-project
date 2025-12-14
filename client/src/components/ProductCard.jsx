import React from 'react'
import defaultProductImage from '@/assets/default-product-image.png'
import {
  addToLocalStorage,
  readLocalStorageItem,
  updateLocalStorageItem
} from '@/services/LocalStorageFunctions';
import {useSnackbar} from 'notistack'
const url = import.meta.env.VITE_IMAGES_BACKEND_URL;

const ProductCard = ({product, onCartChange}) => {
  const {enqueueSnackbar} = useSnackbar();

  const handleAddToCart = () => {
    const storageItems = readLocalStorageItem('cart');

    const existingItem = storageItems.find(item => item._id === product._id);
    if (existingItem) {
      console.log(existingItem);
      existingItem.quantity++;
      updateLocalStorageItem('cart', existingItem);
    } else {
      const cartProduct = {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        quantity: 1,
      }
      addToLocalStorage('cart', cartProduct);
    }

    enqueueSnackbar("Added to cart", {variant: "success"});
    onCartChange();
  };

  return (
    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative">
            <img
              src={product.image ? `${url}${product.image}` : defaultProductImage}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
        </div>
        <div className="p-4">
            <div className="font-bold text-base" style={{ color: 'var(--color-dark-gray)' }}>
              {product.title}
            </div>
            <div className="font-normal text-sm" style={{ color: 'var(--color-dark-gray)' }}>
              {product.brand.name}
            </div>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-lg font-bold">${product.price}</div>
                <button
                  className="px-3 py-1 rounded-md bg-(--color-green) text-sm cursor-pointer" 
                  onClick={() => handleAddToCart(product)}>
                    Add
                </button>
            </div>
        </div>
    </div>
  )
}

export default ProductCard