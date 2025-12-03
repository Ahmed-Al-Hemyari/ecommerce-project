import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchProducts } from "@/services/api-calls";

import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
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

    getProducts();
  }, []);

  return (
    <MainLayout page="products">
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-5">
          {loading ? (<Spinner />) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
      </div>
    </MainLayout>
  );
};

export default Products;
