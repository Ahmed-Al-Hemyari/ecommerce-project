import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { enqueueSnackbar } from 'notistack';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import userService from '@/services/userService';
import productService from '@/services/productService';
import orderService from '@/services/orderService';
import SearchableDropdown from '@/components/UI/Forms/SearchableDropDown';
import Spinner from '@/components/UI/Spinner';
import { Loader2 } from 'lucide-react';

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Current order and related data
  const [order, setOrder] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form fields
  const [user, setUser] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [shipping, setShipping] = useState({
    address1: '',
    address2: '',
    city: '',
    zip: '',
    country: '',
    paymentMethod: 'cod',
  });
  const [payed, setPayed] = useState(false);

  // Errors
  const [formError, setFormError] = useState('');

  // Loading
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  // Clicked
  const [clickedButton, setClickedButton] = useState('');

  // Load users, products, and order
  const getUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      enqueueSnackbar('Failed to load users', { variant: 'error' });
      console.error(error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await productService.getProducts();
      const formatted = response.data.products.map((p) => ({
        ...p,
        category: p.category?.name || 'N/A',
        brand: p.brand?.name || 'N/A',
      }));
      setProducts(formatted);
    } catch (error) {
      enqueueSnackbar(error || 'Failed to update order', { variant: 'error' });
      console.error(error);
    }
  };

  const getOrder = async () => {
    setLoadingFetch(true);
    try {
      const response = await orderService.getOrder(id);
      const data = response.data; // assume this is a single order object

      // Format orderItems to have just product IDs
      const formattedOrderItems = data.orderItems.map(item => ({
        ...item,
        product: item.product._id, // make sure product is just the ID for selection
      }));

      setOrder(data);
      setUser(data.user._id || data.user);
      setOrderItems(formattedOrderItems);
      setShipping(data.shipping);
      setPayed(data.payed || false);
    } catch (error) {
      enqueueSnackbar('Failed to load order', { variant: 'error' });
      console.error(error);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    getUsers();
    getProducts();
    getOrder();
  }, []);

  // Handlers for order items
  const updateItem = (index, field, value) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItem = () => {
    setOrderItems((prev) => [...prev, { product: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setOrderItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setFormError('');

    if (!user) {
      setLoadingSubmit(false);
      setFormError('User is required')
      return false;
    };
    if (!orderItems.length) {
      setLoadingSubmit(false);
      setFormError('At least one product is required')
      return false;
    };

    for (let item of orderItems) {
      if (!item.product) return setFormError('All products must be selected');
      if (!item.quantity || item.quantity <= 0)
      {
        setFormError('Quantity must be greater than 0')
        setLoadingSubmit(false);
        return false;
      }
    }

    if (!shipping.address1 || !shipping.city || !shipping.zip || !shipping.country) {
      setLoadingSubmit(false);
      setFormError('Shipping information is incomplete');
      return false;
    }

    const payload = {
      userId: user._id || user,
      orderItems: orderItems.map((item) => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping,
      payed,
    };

    console.log(payload);

    try {
      await orderService.updateOrder(id, payload);
      return true;
    } catch (error) {
      enqueueSnackbar(error || 'Failed to update order', { variant: 'error' });
      console.error(error);
      return false;
    } finally {
      setLoadingSubmit(false);
      setClickedButton('');
    }
  };


  const resetForm = () => {
    if (!order) return;
    setUser(order.user._id);
    setOrderItems(order.orderItems);
    setShipping(order.shipping);
    setPayed(order.payed || false);
    setFormError('');
  };

  useEffect(() => {
    const submit = async () => {
      switch (clickedButton) {
        case 'update':
          if(!await handleSubmit()) return;
          navigate('/orders', {
            state: {
              message: 'Order updated successfully',
              status: 'success'
            }
          })
          break;
        case 'update_continue':
          if(!await handleSubmit()) return;
          enqueueSnackbar('Order updated successfully', { variant: 'success' });
          getOrder();
          resetForm();
          break;
        default:
          break;
      }
    }

    submit();
  }, [clickedButton])

  return (
    <MainLayout>
      {loadingFetch ? <Spinner/> : (

        <div>
          <div className="flex flex-row justify-between mb-5 px-2 py-3">
            <h1 className="text-3xl font-medium">Update Order</h1>
          </div>

          <div className="flex flex-row justify-end my-5">
            <button
              onClick={resetForm}
              type="button"
              className="px-4 py-2 rounded-md border bg-gray-200 cursor-pointer"
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {formError && <p className="text-sm text-red-500 my-2">{formError}</p>}

            {/* User */}
            <SearchableDropdown
              label="User"
              important
              options={users}
              placeholder="Select user..."
              value={user}
              setValue={setUser}
              formError={formError}
            />

            {/* Order Items */}
            {orderItems.map((item, i) => (
              <div key={i} className="mb-4 border rounded-lg p-4">
                <SearchableDropdown
                  label={`Product No. ${i + 1}`}
                  important
                  options={products}
                  placeholder="Select product..."
                  value={item.product}
                  setValue={(value) => updateItem(i, 'product', value)}
                  formError={formError}
                />

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', Math.max(1, Number(e.target.value)))}
                    className="w-32 border rounded-md px-3 py-2"
                  />
                </div>

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
                      className="text-green-600 text-sm hover:underline"
                    >
                      + Add Product
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Shipping */}
            <div className="border rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Address 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shipping.address1}
                  onChange={(e) => setShipping((prev) => ({ ...prev, address1: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Address 2</label>
                <input
                  type="text"
                  value={shipping.address2}
                  onChange={(e) => setShipping((prev) => ({ ...prev, address2: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={(e) => setShipping((prev) => ({ ...prev, city: e.target.value }))}
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
                    onChange={(e) => setShipping((prev) => ({ ...prev, zip: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shipping.country}
                  onChange={(e) => setShipping((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={shipping.paymentMethod}
                  onChange={(e) => setShipping((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="credit" disabled>Credit Card</option>
                  <option value="paypal" disabled>PayPal</option>
                </select>
              </div>

              {/* Payed Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Paid?</label>
                <input
                  type="checkbox"
                  checked={payed}
                  onChange={() => setPayed((prev) => !prev)}
                />
              </div>
            </div>

            <div className='flex flex-row justify-between mt-5'>
                <div className='flex gap-2'>
                  <button
                      type='button'
                      name='action'
                      value='update'
                      onClick={() => setClickedButton('update')}
                      className={`px-4 py-2 rounded-md border qb-border flex flex-row items-center cursor-pointer ${
                        (loadingSubmit && clickedButton === 'update')
                            ? 'bg-(--color-green)/50 cursor-not-allowed'
                            : 'bg-(--color-green) hover:bg-(--color-green)/80'
                        }`}
                      disabled={clickedButton === 'update_continue'}
                  >
                      {(loadingSubmit && clickedButton === 'update') && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
                      Update
                  </button>
                  <button
                      type='button'
                      name='action'
                      value='update_continue'
                      onClick={() => setClickedButton('update_continue')}
                      className={`px-4 py-2 rounded-md border qb-border flex flex-row items-center cursor-pointer ${
                        (loadingSubmit && clickedButton === 'update_continue')
                            ? 'bg-(--color-green)/50 cursor-not-allowed'
                            : 'bg-(--color-green) hover:bg-(--color-green)/80'
                        }`}
                      disabled={clickedButton === 'update_continue'}
                  >
                    {(loadingSubmit && clickedButton === 'update_continue') && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
                    Update & Continue Editing
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
      )}
    </MainLayout>
  );
};

export default UpdateOrder;
