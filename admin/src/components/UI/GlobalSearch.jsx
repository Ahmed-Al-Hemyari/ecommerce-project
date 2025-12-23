import brandService from '@/services/brandService';
import categoryService from '@/services/categoryService';
import orderService from '@/services/orderService';
import productService from '@/services/productService';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ---------------- Small reusable section ---------------- */
const Section = ({ title, items, render }) => {
  if (!items.length) return null;

  return (
    <div className="border-t first:border-t-0">
      <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">
        {title}
      </p>
      <ul className="px-2 pb-2 text-black space-y-1">
        {items.map(render)}
      </ul>
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const GlobalSearch = () => {
  const navigate = useNavigate();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  /* ----------- Debounce search ----------- */
  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
      setCategories([]);
      setBrands([]);
      setProducts([]);
      setOrders([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const [
          usersRes,
          categoriesRes,
          brandsRes,
          productsRes,
          ordersRes
        ] = await Promise.all([
          userService.getUsers(search),
          categoryService.getCategories(search),
          brandService.getBrands(search),
          productService.getProducts(search),
          orderService.getOrders(search)
        ]);

        setUsers(usersRes.data.users.slice(0, 5));
        setCategories(categoriesRes.data.categories.slice(0, 5));
        setBrands(brandsRes.data.brands.slice(0, 5));
        setProducts(productsRes.data.products.slice(0, 5));
        setOrders(ordersRes.data.orders.slice(0, 5));
      } catch {
        enqueueSnackbar('Search failed', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  /* ----------- Close on outside click ----------- */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ----------- Click handler ----------- */
  const goTo = (path) => {
    setOpen(false);
    setSearch('');
    navigate(path);
  };

  return (
    <div ref={ref} className="relative mx-4 hidden sm:flex">
      {/* Input */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        placeholder="Search anything..."
        className="w-60 rounded-full border border-[#555] bg-[#444] px-4 py-2 text-sm text-white placeholder-gray-300 focus:outline-none"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-xl border bg-white shadow-xl overflow-hidden z-50">
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-500">
              Searching...
            </p>
          )}

          {!loading && (
            <>
              <Section
                title="Users"
                items={users}
                render={(u) => (
                  <li
                    key={u._id}
                    onClick={() => goTo(`/users/show/${u._id}`)}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                  >
                    {u.name}
                  </li>
                )}
              />

              <Section
                title="Categories"
                items={categories}
                render={(c) => (
                  <li
                    key={c._id}
                    onClick={() => goTo(`/categories/show/${c._id}`)}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {c.name}
                  </li>
                )}
              />

              <Section
                title="Brands"
                items={brands}
                render={(b) => (
                  <li
                    key={b._id}
                    onClick={() => goTo(`/brands/show/${b._id}`)}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {b.name}
                  </li>
                )}
              />

              <Section
                title="Products"
                items={products}
                render={(p) => (
                  <li
                    key={p._id}
                    onClick={() => goTo(`/products/show/${p._id}`)}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {p.name}
                  </li>
                )}
              />

              <Section
                title="Orders"
                items={orders}
                render={(o) => (
                  <li
                    key={o._id}
                    onClick={() => goTo(`/orders/show/${o._id}`)}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    #{o.orderId}
                  </li>
                )}
              />

              {!users.length &&
                !categories.length &&
                !brands.length &&
                !products.length &&
                !orders.length && (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No results found
                  </p>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;




// import brandService from '@/services/brandService';
// import categoryService from '@/services/categoryService';
// import orderService from '@/services/orderService';
// import productService from '@/services/productService';
// import userService from '@/services/userService';
// import { enqueueSnackbar } from 'notistack';
// import { useState, useRef, useEffect } from 'react';

// const GlobalSearch = () => {
//     const [open, setOpen] = useState(false);
//     const [search, setSearch] = useState('');
//     const ref = useRef(null);

//     // Data
//     const [users, setUsers] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [orders, setOrders] = useState([]);

//     // Fetching
//     const getUsers = async () => {
//         try {
//             const response = await userService.getUsers(search);
//             setUsers(response.data.users.slice(0, 5));
//         } catch (error) {
//             enqueueSnackbar("Failed to load users");
//         }
//     }
//     const getCategories = async () => {
//         try {
//             const response = await categoryService.getCategories(search);
//             setCategories(response.data.categories.slice(0, 5));
//         } catch (error) {
//             enqueueSnackbar("Failed to load categories");
//         }
//     }
//     const getBrands = async () => {
//         try {
//             const response = await brandService.getBrands(search);
//             setBrands(response.data.brands.slice(0, 5));
//         } catch (error) {
//             enqueueSnackbar("Failed to load brands");
//         }
//     }
//     const getProducts = async () => {
//         try {
//             const response = await productService.getProducts(search);
//             setProducts(response.data.products.slice(0, 5));
//         } catch (error) {
//             enqueueSnackbar("Failed to load products");
//         }
//     }
//     const getOrders = async () => {
//         try {
//             const response = await orderService.getOrders(search);
//             setOrders(response.data.orders.slice(0, 5));
//         } catch (error) {
//             enqueueSnackbar("Failed to load orders");
//         }
//     }

//     useEffect(() => {
//         if (!search.trim()) {
//             setUsers([]);
//             setCategories([]);
//             setBrands([]);
//             setProducts([]);
//             setOrders([]);
//             return;
//         }

//         getUsers();
//         getCategories();
//         getBrands();
//         getProducts();
//         getOrders();
//     }, [search]);


//     // Close on outside click
//     useEffect(() => {
//         const handler = (e) => {
//         if (ref.current && !ref.current.contains(e.target)) {
//             setOpen(false);
//         }
//         };
//         document.addEventListener('mousedown', handler);
//         return () => document.removeEventListener('mousedown', handler);
//     }, []);

//     return (
//         <div ref={ref} className="relative flex mx-4">
//             {/* Input */}
//             <input
//                 type="text"
//                 placeholder="Search..."
//                 onChange={(e) => { setOpen(true); setSearch(e.target.value)}}
//                 className="w-52 rounded-full border-[#555555] bg-[#444444] px-4 py-2 text-sm focus:border-[#555555] focus:outline-none"
//             />

//             {/* Dropdown */}
//             {open && (
//                 <div className="absolute max-w-60 left-0 right-0 mt-11 rounded-xl border bg-white shadow-lg overflow-auto">
//                     {/* Users */}
//                     {users.length > 0 && (
//                         <ul className="max-h-60 p-2 overflow-auto text-sm">
//                             <p className='text-sm text-[#666666]'>Users</p>
//                             {users.map(user => (
//                                 <li key={user._id} className='cursor-pointer text-black font-medium px-1 py-2 hover:bg-gray-100'>
//                                     {user.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                     {/* Categories */}
//                     {categories.length > 0 && (
//                         <ul className="max-h-60 p-2 overflow-auto text-sm">
//                             <p className='text-sm text-[#666666]'>Categories</p>
//                             {categories.map(category => (
//                                 <li key={category._id} className='cursor-pointer text-black font-medium px-1 py-2 hover:bg-gray-100'>
//                                     {category.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                     {/* Brands */}
//                     {brands.length > 0 && (
//                         <ul className="max-h-60 p-2 overflow-auto text-sm">
//                             <p className='text-sm text-[#666666]'>Brands</p>
//                             {brands.map(brand => (
//                                 <li key={brand._id} className='cursor-pointer text-black font-medium px-1 py-2 hover:bg-gray-100'>
//                                     {brand.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                     {/* Products */}
//                     {products.length > 0 && (
//                         <ul className="max-h-60 p-2 overflow-auto text-sm">
//                             <p className='text-sm text-[#666666]'>Products</p>
//                             {products.map(product => (
//                                 <li key={product._id} className='cursor-pointer text-black font-medium px-1 py-2 hover:bg-gray-100'>
//                                     {product.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                     {/* Orders */}
//                     {orders.length > 0 && (
//                         <ul className="max-h-60 p-2 overflow-auto text-sm">
//                             <p className='text-sm text-[#666666]'>Orders</p>
//                             {orders.map(order => (
//                                 <li key={order._id} className='cursor-pointer text-black font-medium px-1 py-2 hover:bg-gray-100'>
//                                     {order.orderId}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
                    
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GlobalSearch;
