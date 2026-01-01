import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import { 
  productService,
  categoryService,
  brandService
 } from '../services/api-calls';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Hero from '@/components/Hero';
import GoToCartButton from '../components/GoToCartButton';
import { readLocalStorageItem } from '../services/LocalStorageFunctions';
import { useSnackbar } from 'notistack';
import BrandCard from '../components/BrandCard';

const Home = () => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);
  const [user, setUser] = useState(null);
  // loading
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  // Limits
  const [categoryLimit, setCategoryLimit] = useState(4);
  const [brandLimit, setBrandLimit] = useState(4);

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCartChange = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };

  const getBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await brandService.getBrands();
      setBrands(response.data.brands);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load brands", { variant: 'error' });
    } finally {
      setLoadingBrands(false);
    }
  }

  const getCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load categories", { variant: 'error' });
    } finally {
      setLoadingCategories(false);
    }
  }

  const getProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load products", { variant: 'error' });
    } finally {
      setLoadingProducts(false);
    }
  }

  // Toggle Limits
  const toggleCategory = () => {
    if (categoryLimit === 4) 
    {
      setCategoryLimit(100);
    }
    else {
      setCategoryLimit(4);
    }
  }
  const toggleBrand = () => {
    if (brandLimit === 4) 
    {
      setBrandLimit(100);
    }
    else {
      setBrandLimit(4);
    }
  }

  // Initial load
  useEffect(() => {
    const load = async () => {
      getBrands();
      getCategories();
      getProducts();

      // User from localStorage
      const storedUser = readLocalStorageItem('user');
      setUser(storedUser || null);

      // Cart
      handleCartChange();
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
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>
            Shop By Brand
          </h3>
          <button className="text-sm cursor-pointer" onClick={toggleBrand}>{brandLimit === 4 ? 'View all' : 'View less'}</button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingBrands ? (
            <div className="flex w-full col-span-2 md:col-span-4 p-6 justify-center items-center">
              <Spinner />
            </div>
          ) : (
             brands.length === 0 ? (
              <h1 className="text-lg">No Brands Found</h1>
            ) : (
              brands.slice(0, brandLimit).map(brand => (
                <BrandCard key={brand._id} brand={brand} />
              ))
            )
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-gray)' }}>
            Shop By Category
          </h3>
          <button className="text-sm cursor-pointer" onClick={toggleCategory}>{categoryLimit === 4 ? 'View all' : 'View Less'}</button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingCategories ? (
            <div className="flex w-full col-span-2 md:col-span-4 p-6 justify-center items-center">
              <Spinner />
            </div>
          ) : (
            categories.length === 0 ? (
              <h1 className="text-lg">No Categories Found</h1>
            ) : (
              categories.slice(0, categoryLimit).map(category => (
                <CategoryCard key={category._id} category={category} />
              ))
            )
          )}
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
          {loadingProducts ? (
            <div className="flex w-full col-span-2 md:col-span-4 p-6 justify-center items-center">
              <Spinner />
            </div>
          ) : (
            products.length === 0 ? (
              <h1 className="text-lg">No Products Found</h1>
            ) : (
              products.slice(0, 4).map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onCartChange={handleCartChange}
                />
              ))
            )
          )}
        </div>
      </section>

    </MainLayout>
  );
};

export default Home;
