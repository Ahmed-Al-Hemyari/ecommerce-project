import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchProducts } from "@/services/api-calls";

import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import {
  readLocalStorageItem
} from '../services/LocalStorageFunctions'
import GoToCartButton from "../components/GoToCartButton";
import { useSnackbar } from "notistack";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const checkCart = () => {
      const cart = readLocalStorageItem('cart') || [];
      setIsCartEmpty(cart.length === 0);
    };
    
    if(location.state?.message)
    {
      enqueueSnackbar(location.state.message, {variant: location.state.status});
    }

    checkCart();
    getProducts();
  }, [location.state]);

  const handleCartChange = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };


  return (
    <MainLayout page="products">
      {!isCartEmpty && <GoToCartButton/>}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-5">
          {loading ? (<Spinner />) : (
            products.length === 0 ?
              <h1 className='text-lg'>No Products Found</h1> :
            products.map(product => (
              <ProductCard key={product._id} product={product} onCartChange={handleCartChange} />
            ))
          )}
      </div>
    </MainLayout>
  );
};

export default Products;
