import React, {useState, useEffect} from 'react'
import MainLayout from '@/layouts/MainLayout'
import Spinner from '../components/Spinner'
import ProductCard from '../components/ProductCard'
import {iconMap} from '@/services/icons.js'
import { fetchProducts, fetchCategories } from '@/services/api-calls'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import Hero from '@/components/Hero'

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getProducts = async () => {
        try {
          const data = await fetchProducts();
          setProducts(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      const getCategories = async () => {
        try {
          const data = await fetchCategories();
          setCategories(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getProducts();
      getCategories();
    }, []);
  
  return (
    <MainLayout page="home">
      {/* Hero */}
      <Hero/>

      {/* Categories */}
      <section className="max-w-7xl mx-auto p-6">
        <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark-gray)' }}>Shop by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <CategoryCard key={category._id} category={category}/>
          ))}
        </div>
      </section>

      {/* Trending products */}
      <section className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>Trending & Best Sellers</h3>
          <Link className="text-sm" to={'/products'}>View all</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (<Spinner />) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>
    </MainLayout>
  )
}

export default Home



// /*
// QuickBuy Home Page - Single-file React component (Tailwind CSS)
// Usage:
// 1. Ensure Tailwind CSS is configured in your Vite/CRA project.
// 2. Drop this file into your components or pages folder and import it in App.jsx.
// 3. This component sets CSS color variables on mount using JavaScript so it matches your palette.

// Features included:
// - Hero with CTA
// - Category cards
// - Trending product grid with add-to-cart buttons (UI-only)
// - Trust / features section
// - Promo banner
// - Reviews carousel (simple horizontal scroll)
// - Newsletter signup
// - Footer

// This is a presentational component with dummy data. Tell me if you want API hooks, Zustand/cart integration, or animation tweaks.
// */

// import React, { useEffect } from 'react';

// export default function QuickBuyHome() {
//   useEffect(() => {
//     // Apply your brand colors as CSS variables so Tailwind utilities can reference them via inline styles if needed
//     const root = document.documentElement;
//     root.style.setProperty('--color-dark-gray', '#333333');
//     root.style.setProperty('--color-light-gray', '#CDCDCD');
//     root.style.setProperty('--color-green', '#82E2BB');
//   }, []);

//   const categories = [
//     { id: 1, title: 'Electronics', icon: '🔌' },
//     { id: 2, title: 'Fashion', icon: '👗' },
//     { id: 3, title: 'Home', icon: '🏠' },
//     { id: 4, title: 'Beauty', icon: '💄' },
//   ];

//   const products = [
//     { id: 1, title: 'Wireless Headphones', price: '79.99', img: 'https://via.placeholder.com/400x300?text=Headphones', badge: 'Hot' },
//     { id: 2, title: 'Classic Sneakers', price: '59.99', img: 'https://via.placeholder.com/400x300?text=Sneakers', badge: 'New' },
//     { id: 3, title: 'Coffee Maker', price: '39.99', img: 'https://via.placeholder.com/400x300?text=Coffee+Maker', badge: 'Sale' },
//     { id: 4, title: 'Smart Watch', price: '129.99', img: 'https://via.placeholder.com/400x300?text=Smart+Watch', badge: '' },
//   ];

//   const reviews = [
//     { id: 1, name: 'Sara M.', text: 'Fast delivery and excellent quality!', stars: 5 },
//     { id: 2, name: 'Omar A.', text: 'Great prices. I keep coming back.', stars: 5 },
//     { id: 3, name: 'Lina K.', text: 'Customer support helped me quickly.', stars: 4 },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       {/* Inline tiny styles to make CTAs use your brand colors */}
//       <style>{`
//         .qb-cta { background-color: var(--color-green); color: var(--color-dark-gray); }
//         .qb-ghost { border-color: var(--color-dark-gray); color: var(--color-dark-gray); }
//         .qb-border { border-color: var(--color-light-gray); }
//       `}</style>

//       {/* Promo Banner */}
//       <div className="w-full py-2 text-center text-sm font-medium" style={{ backgroundColor: 'var(--color-green)', color: 'var(--color-dark-gray)' }}>
//         Get 20% Off on your first order — use code <strong>QUICK20</strong>
//       </div>

//       {/* Header */}
//       <header className="max-w-7xl mx-auto p-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-green)' }}>
//             <span className="font-bold">QB</span>
//           </div>
//           <h1 className="text-xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>QuickBuy</h1>
//         </div>
//         <nav className="hidden md:flex gap-6 items-center text-sm">
//           <a className="hover:text-black">Shop</a>
//           <a className="hover:text-black">Categories</a>
//           <a className="hover:text-black">About</a>
//           <a className="hover:text-black">Contact</a>
//         </nav>
//         <div className="flex gap-3 items-center">
//           <button className="px-4 py-2 rounded-md qb-ghost border qb-border">Login</button>
//           <button className="px-4 py-2 rounded-md qb-cta">Cart</button>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6">
//         <div>
//           <h2 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: 'var(--color-dark-gray)' }}>
//             Shop Smarter. <span style={{ color: 'var(--color-green)' }}>Shop Faster.</span>
//           </h2>
//           <p className="mt-4 text-gray-600 max-w-xl">Find great deals, fast delivery and trusted quality. QuickBuy makes online shopping effortless.</p>

//           <div className="mt-6 flex gap-4">
//             <button className="px-6 py-3 rounded-md qb-cta font-semibold shadow-md">Shop Now</button>
//             <button className="px-6 py-3 rounded-md border qb-ghost">Browse Categories</button>
//           </div>

//           <div className="mt-8 grid grid-cols-3 gap-3">
//             <div className="text-center">
//               <div className="text-2xl">🚚</div>
//               <div className="text-sm font-medium">Fast Delivery</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl">💳</div>
//               <div className="text-sm font-medium">Secure Payments</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl">💬</div>
//               <div className="text-sm font-medium">24/7 Support</div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center">
//           <div className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden bg-white">
//             <img src="https://via.placeholder.com/700x500?text=Hero+Product" alt="Hero product" className="w-full h-auto object-cover" />
//           </div>
//         </div>
//       </section>

//       {/* Categories */}
//       <section className="max-w-7xl mx-auto p-6">
//         <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark-gray)' }}>Shop by Category</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {categories.map(cat => (
//             <div key={cat.id} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer flex flex-col items-center">
//               <div className="text-3xl mb-3">{cat.icon}</div>
//               <div className="font-medium">{cat.title}</div>
//             </div>
//           ))}
//         </div>
//       </section>

      // {/* Trending products */}
      // <section className="max-w-7xl mx-auto p-6">
      //   <div className="flex items-center justify-between">
      //     <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>Trending & Best Sellers</h3>
      //     <a className="text-sm">View all</a>
      //   </div>

      //   <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      //     {products.map(p => (
      //       <div key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
      //         <div className="relative">
      //           <img src={p.img} alt={p.title} className="w-full h-48 object-cover" />
      //           {p.badge && (
      //             <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-green)', color: 'var(--color-dark-gray)' }}>{p.badge}</span>
      //           )}
      //         </div>
      //         <div className="p-4">
      //           <div className="font-medium text-sm" style={{ color: 'var(--color-dark-gray)' }}>{p.title}</div>
      //           <div className="mt-2 flex items-center justify-between">
      //             <div className="text-lg font-bold">${p.price}</div>
      //             <button className="px-3 py-1 rounded-md qb-cta text-sm">Add</button>
      //           </div>
      //         </div>
      //       </div>
      //     ))}
      //   </div>
      // </section>

//       {/* Reviews */}
//       <section className="max-w-7xl mx-auto p-6">
//         <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark-gray)' }}>What our customers say</h3>
//         <div className="flex gap-4 overflow-x-auto pb-4">
//           {reviews.map(r => (
//             <div key={r.id} className="min-w-[260px] bg-white rounded-lg p-4 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">{r.name.split(' ')[0][0]}</div>
//                 <div>
//                   <div className="font-medium">{r.name}</div>
//                   <div className="text-sm text-gray-500">{Array.from({ length: r.stars }).map((_, i) => '★').join('')}</div>
//                 </div>
//               </div>
//               <p className="mt-3 text-sm text-gray-600">{r.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="max-w-7xl mx-auto p-6">
//         <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
//           <div className="mb-4 md:mb-0">
//             <h4 className="text-xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>Stay ahead with QuickBuy deals</h4>
//             <p className="text-sm text-gray-600">Sign up and get exclusive offers straight to your inbox.</p>
//           </div>
//           <div className="flex w-full md:w-auto gap-2">
//             <input aria-label="email" type="email" placeholder="Your email" className="px-4 py-3 border qb-border rounded-md w-full md:w-72" />
//             <button className="px-4 py-3 rounded-md qb-cta font-semibold">Subscribe</button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="mt-8 bg-[var(--color-dark-gray)] text-[var(--color-light-gray)]">
//         <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div>
//             <h5 className="font-semibold mb-3 text-white">QuickBuy</h5>
//             <p className="text-sm">Fast delivery. Great deals. Trusted shopping.</p>
//           </div>

//           <div>
//             <h6 className="font-medium mb-2">Shop</h6>
//             <ul className="text-sm space-y-1">
//               <li>New Arrivals</li>
//               <li>Best Sellers</li>
//               <li>Offers</li>
//             </ul>
//           </div>

//           <div>
//             <h6 className="font-medium mb-2">Support</h6>
//             <ul className="text-sm space-y-1">
//               <li>Help Center</li>
//               <li>Returns</li>
//               <li>Track Order</li>
//             </ul>
//           </div>

//           <div>
//             <h6 className="font-medium mb-2">Company</h6>
//             <ul className="text-sm space-y-1">
//               <li>About Us</li>
//               <li>Careers</li>
//               <li>Contact</li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-[var(--color-light-gray)]/30 p-4 text-sm text-center text-[var(--color-light-gray)]">© {new Date().getFullYear()} QuickBuy — All rights reserved</div>
//       </footer>
//     </div>
//   );
// }
