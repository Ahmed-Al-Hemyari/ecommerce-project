import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories, fetchBrands } from '@/services/api-calls';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Hero from '@/components/Hero';
import GoToCartButton from '../components/GoToCartButton';
import { readLocalStorageItem } from '../services/LocalStorageFunctions';
import { useSnackbar } from 'notistack';
import BrandCard from '../components/BrandCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCartChange = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchBrands()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error(error);
      }

      // User from localStorage
      const storedUser = readLocalStorageItem('user');
      setUser(storedUser || null);

      // Cart
      handleCartChange();

      setLoading(false);
    };

    load();
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
  }, [location.state]);

  return (
    <MainLayout page="home">
      {!isCartEmpty && <GoToCartButton />}

      <Hero />

      {/* Brands */}
      <section className="max-w-7xl mx-auto p-6">
        <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
          Shop by Brand
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map(brand => (
            <BrandCard key={brand._id} brand={brand} />
          ))}
        </div>
      </section>

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

      {/* Products */}
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
