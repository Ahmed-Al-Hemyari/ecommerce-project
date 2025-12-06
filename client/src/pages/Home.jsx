import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '@/services/api-calls';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Hero from '@/components/Hero';
import GoToCartButton from '../components/GoToCartButton';
import { readLocalStorageItem } from '../services/LocalStorageFunctions';
import { useSnackbar } from 'notistack';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const handleCartChange = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch products and categories
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      }

      // Read user from localStorage
      const storedUser = readLocalStorageItem('user');
      setUser(storedUser || null);

      // Check local cart
      handleCartChange();

      setLoading(false);
    };

    fetchData();

    // Show snackbar if coming from another page
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, { variant: location.state.status });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <MainLayout page="home">
      {!isCartEmpty && <GoToCartButton />}

      {/* Hero section */}
      <Hero/>

      {/* Categories */}
      <section className="max-w-7xl mx-auto p-6">
        <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
          Shop by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>

      {/* Trending products */}
      <section className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>
            Trending & Best Sellers
          </h3>
          <Link className="text-sm" to="/products">View all</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <h1 className="text-lg">No Products Found</h1>
          ) : (
            products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onCartChange={handleCartChange}
              />
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
