import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import { enqueueSnackbar } from 'notistack';
import CreateForm from '@/components/UI/Forms/CreateForm';
import productService from '@/services/productService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import { Input } from '@/components/UI/input';
import SearchableDropdown from '@/components/UI/Forms/SearchableDropDown';
import orderService from '@/services/orderService';

const CreateOrder = () => {
  // Essentials
  const navigate = useNavigate();
  const location = useLocation();
  // Data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  // Fields
  const [user, setUser] = useState();
  const [orderItems, setOrderItems] = useState([{
    product: '', 
    quantity: 1, 
    price: 0,
  }]);
  const [shipping, setShipping] = useState({
    address1: '',
    address2: '',
    city: '',
    zip: '',
    country: '',
    paymentMethod: 'cod',
  })
  // Errors
  const [formError, setFromError] = useState('');
  // Ruplicate
  const [order, setOrder] = useState();
  
  // Handlers
  const updateItem = (index, field, value) => {
    setOrderItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const addItem = () => {
    setOrderItems(prev => [
      ...prev,
      { product: '', quantity: 1, price: 0 }
    ]);
  };

  const removeItem = (index) => {
    setOrderItems(prev => {
      if (prev.length === 1) return prev; // prevent removing last
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFromError('');

    if (!user) {
      setFromError('User is required');
      return;
    }

    if (orderItems.length === 0) {
      setFromError('At least one product is required');
      return;
    }

    for (let item of orderItems) {
      if (!item.product) {
        setFromError('All products must be selected');
        return;
      }
      if (!item.quantity || item.quantity <= 0) {
        setFromError('Quantity must be greater than 0');
        return;
      }
    }

    if (
      !shipping.address1 ||
      !shipping.city ||
      !shipping.zip ||
      !shipping.country
    ) {
      setFromError('Shipping information is incomplete');
      return;
    }

    const payload = {
      userId: user._id || user,
      orderItems: orderItems.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping,
    };

    console.log(payload);


    try {
      const response = await orderService.createOrder(payload);
      enqueueSnackbar('Order created successfully', {
        variant: 'success',
      });

      resetForm();
      navigate('/orders');

    } catch (error) {
      enqueueSnackbar('Failed to create order', {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const resetForm = () => {
    setUser(null);

    setOrderItems([
      {
        product: '',
        quantity: 1,
        price: 0,
      },
    ]);

    setShipping({
      address1: '',
      address2: '',
      city: '',
      zip: '',
      country: '',
      paymentMethod: 'cod',
    });

    setFromError('');
  };


  const getUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      enqueueSnackbar("Failed to load users", { variant: 'error' });
      console.error(error);
    }
  }

  const getProducts = async () => {
    try {
      const response = await productService.getProducts();
      const formatted = response.data.products.map(product => ({
        ...product,
        category: product.category?.name || 'N/A',
        brand: product.brand?.name || 'N/A',
      }));
      setProducts(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load products", {
        variant: 'error'
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
    getProducts();
  }, []);

  // Snackbar listener
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });

      // Clear state to prevent showing again
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (location.state?.id) {
      const id = location.state?.id;
      const fetchOrder = async () => {        
        try {
          const response = await orderService.getOrder(id);
          setOrder(response.data);
        } catch (error) {
          enqueueSnackbar("Failed to load product");
        }
      }

      fetchOrder();
    }
  }, [location.state]);

  useEffect(() => {
    if(!order) return;

    setUser(order.user._id || order.user);

    // Format orderItems to have just product IDs
    const formattedOrderItems = order.orderItems.map(item => ({
      ...item,
      product: item.product._id,
    }));

    setOrderItems(formattedOrderItems);
    setShipping(order.shipping);
  }, [order]);

  return (
    <MainLayout>
      <div>
            <div className='flex flex-row justify-between mb-5 px-2 py-3'>
                <h1 className='text-3xl font-medium'>Create Order</h1>
            </div>

            <div className='flex flex-row justify-end my-5'>
                <button
                    onClick={resetForm}
                    type="button"
                    className="px-4 py-2 rounded-md border qb-border bg-gray-200 text-(--color-dark-gray) cursor-pointer"
                >
                    Reset
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <p className='text-sm text-red-500 my-2'>{formError}</p>

                <SearchableDropdown
                  label='User'
                  important
                  options={users}
                  placeholder='Select user...'
                  value={user}
                  setValue={setUser}
                  formError={formError}
                />

                {orderItems.map((item, i) => (
                  <div key={i} className="mb-4 border rounded-lg p-4">

                    {/* Product */}
                    <SearchableDropdown
                      label={`Product No. ${i + 1}`}
                      important
                      options={products}
                      placeholder="Select product..."
                      value={item.product}
                      setValue={(value) => updateItem(i, 'product', value)}
                      formError={formError}
                    />

                    {/* Quantity */}
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(i, 'quantity', Math.max(1, Number(e.target.value)))
                        }
                        className="w-32 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-dark-green)"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between mt-3">
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}

                      {i === orderItems.length - 1 && (
                        <button
                          type="button"
                          onClick={addItem}
                          className="text-(--color-dark-green) text-sm hover:underline"
                        >
                          + Add Product
                        </button>
                      )}
                    </div>

                  </div>
                ))}

                <div className="border rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>

                  {/* Address 1 */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Address 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.address1}
                      onChange={(e) =>
                        setShipping(prev => ({ ...prev, address1: e.target.value }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  {/* Address 2 */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Address 2
                    </label>
                    <input
                      type="text"
                      value={shipping.address2}
                      onChange={(e) =>
                        setShipping(prev => ({ ...prev, address2: e.target.value }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  {/* City + ZIP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping(prev => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.zip}
                        onChange={(e) =>
                          setShipping(prev => ({ ...prev, zip: e.target.value }))
                        }
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.country}
                      onChange={(e) =>
                        setShipping(prev => ({ ...prev, country: e.target.value }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Method <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col gap-2">
                      {/* Credit Card */}
                      <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit"
                          disabled
                        />
                        Credit Card
                      </label>

                      {/* PayPal */}
                      <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          disabled
                        />
                        PayPal
                      </label>

                      {/* Cash on Delivery */}
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={shipping.paymentMethod === 'cod'}
                          onChange={() =>
                            setShipping(prev => ({ ...prev, paymentMethod: 'cod' }))
                          }
                        />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>


                <div className='flex flex-row justify-between mt-5'>
                    <div className='flex gap-2'>
                      <button
                          type='submit'
                          name='action'
                          value='create'
                          className="px-4 py-2 rounded-md bg-(--color-green) border qb-border cursor-pointer"
                      >
                          Create
                      </button>
                      <button
                          type='submit'
                          name='action'
                          value='create_add'
                          className="px-4 py-2 rounded-md bg-(--color-green) border qb-border cursor-pointer"
                      >
                          Create & Add Another
                      </button>
                    </div>

                    <Link
                        to={'/orders'}
                        className="px-4 py-2 rounded-md bg-(--color-light-gray) border qb-border"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    </MainLayout>
  )
}

export default CreateOrder