import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { productService, categoryService, brandService } from "@/services/api-calls";

import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import {
  readLocalStorageItem
} from '../services/LocalStorageFunctions'
import GoToCartButton from "../components/GoToCartButton";
import { enqueueSnackbar } from "notistack";
import Filters from "../components/Filters";
import Search from "../components/Search";
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

const Products = () => {
  // Essenials
  const navgiate = useNavigate();
  const location = useLocation();
  // data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  // Cart
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  // Filters Props
  


  // Snackbar listener
  useEffect(() => {  
    if(location.state?.message)
    {
      enqueueSnackbar(location.state.message, {variant: location.state.status});
    }
  }, [location.state]);

  // Fetching Fucntions
  const getProducts = async (search, category, brand, minPrice, maxPrice, page) => {
    try {
      const response = await productService.getProducts({ search, category, brand, minPrice, maxPrice, page});
      setProducts(response.data.products);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const getBrands = async () => {
    try {
      const response = await brandService.getBrands();
      setBrands(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load brands", { variant: 'error' });
    }
  }
  
  const getCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load categories", { variant: 'error' });
    }
  }

  // Check cart
  const checkCart = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };
  // Cart
  const handleCartChange = () => {
    const cart = readLocalStorageItem('cart') || [];
    setIsCartEmpty(cart.length === 0);
  };

  // Initial useEffect()
  useEffect(() => {
    const categoryId = location.state?.categoryId;
    const brandId = location.state?.brandId;

    if (categoryId) {
      setCategory(categoryId);
    }
    if (brandId) {
      setBrand(brandId);
    }

    checkCart();
    getProducts();
    getBrands();
    getCategories();
  }, []);

  // Filters useEffect()
  useEffect(() => {
    let minPrice = 0;
    let maxPrice = 0;
    switch (priceRange) {
      case '1':
        minPrice = 100;
        maxPrice = 500;
        break;
      case '2':
        minPrice = 500;
        maxPrice = 1000;
        break;
      case '3':
        minPrice = 1000;
        maxPrice = 2500;
        break;
      case '4':
        minPrice = 2500;
        maxPrice = 5000;
        break;
      case '5':
        minPrice = 5000;
        maxPrice = 10000;
        break;
      default:
        minPrice = 0;
        maxPrice = 1000000;
        break;
    }

    getProducts(search, category, brand, minPrice, maxPrice, currentPage);
  }, [search, category, brand, priceRange, currentPage])


  const filters = [
    {
      label: 'Category',
      options: categories.slice(0, 10),
      value: category,
      setValue: setCategory,
    },
    {
      label: 'Brand',
      options: brands.slice(0, 10),
      value: brand,
      setValue: setBrand,
    },
    {
      label: 'Price',
      options: [
        { name: '100$ - 500$', _id: '1' },
        { name: '500$ - 1000$', _id: '2' },
        { name: '1000$ - 2500$', _id: '3' },
        { name: '2500$ - 5000$', _id: '4' },
        { name: '5000$ - 10000$', _id: '5' },
      ],
      value: priceRange,
      setValue: setPriceRange,
    },
  ];

  return (
    <MainLayout page="products">
      {!isCartEmpty && <GoToCartButton/>}
      <Search
        value={search}
        setValue={setSearch}
      />
      <Filters inputs={filters}/>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-5">
        {loading ? (<Spinner />) : (
          products.length === 0 ?
            <h1 className='text-lg'>No Products Found</h1> :
          products.map(product => (
            <ProductCard key={product._id} product={product} onCartChange={handleCartChange}/>
          ))
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
    </MainLayout>
  );
};

export default Products;
