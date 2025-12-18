import defaultImage from '@/assets/default-product-image.png';
import productService from '@/services/productService';
import { useEffect, useState } from 'react';


const OrderItemCard = ({ item, onViewProduct }) => {
  const { product, quantity, price } = item;
  const subtotal = quantity * price;

  const [fetchedProduct, setFetchedProduct] = useState([]);
  
    const getProduct = async () => {
        try {
        const response = await productService.getProduct(product._id);
        setFetchedProduct(response.data);
        } catch (error) {
        enqueueSnackbar("Failed to load product", { variant: 'error' });
        }
    }

    useEffect(() => {
        getProduct();
    }, []);

  return (
    <div className="flex gap-4 mb-5 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <img
            src={
                fetchedProduct?.image
                ? `${import.meta.env.VITE_BACKEND_IMAGES_URL}${fetchedProduct.image}`
                : defaultImage
            }
            alt={fetchedProduct?.name || 'Product'}
            className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-gray-900">
            {fetchedProduct?.name}
          </h3>

          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-700">
            x{quantity}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            Unit: <b className="text-gray-900">${price.toFixed(2)}</b>
          </span>
          <span>
            Subtotal: <b className="text-gray-900">${subtotal.toFixed(2)}</b>
          </span>
        </div>

        {/* Action */}
        {onViewProduct && (
          <button
            onClick={() => onViewProduct(fetchedProduct?._id)}
            className="mt-1 w-fit rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            View product
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItemCard;