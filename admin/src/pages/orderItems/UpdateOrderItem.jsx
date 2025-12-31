import MainLayout from '@/components/Layouts/MainLayout';
import CreateForm from '@/components/UI/Forms/CreateForm';
import UpdateForm from '@/components/UI/Forms/UpdateForm';
import Spinner from '@/components/UI/Spinner';
import { orderItemsService } from '@/services/orderItemsService';
import productService from '@/services/productService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const UpdateOrderItem = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Props
    const { id } = useParams();
    // Loading
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [formError, setFormError] = useState('');
    // Data
    const [products, setProducts] = useState([]);
    // Fields
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    // Inputs
    const inputs = [
        { 
            label: 'Product', 
            important: true, 
            type: 'select', 
            placeholder: 'Select Product...', 
            options: products,
            value: product, 
            setValue: setProduct 
        },
        {
            label: 'Quantity',
            important: true,
            type: 'number',
            value: quantity,
            setValue: setQuantity
        }
    ];

    const getProducts = async () => {
        try {
            const response = await productService.getProducts();
            setProducts(response.data.products);
        } catch (error) {
            enqueueSnackbar(error || "Failed to load products", {
            variant: 'error'
            });
            console.error(error)
        }
    }

    const getOrderItem = async () => {
        try {
            const response = await orderItemsService.getOrderItem(id);
            const orderItem = response.data.orderItem;
            setProduct(orderItem.product._id);
            setQuantity(orderItem.quantity);
        } catch (error) {
            enqueueSnackbar(error || "Failed to load order item", {
            variant: 'error'
            });
            console.error(error)
        }
    }

    const resetForm = () => {
        setProduct('');
        setQuantity(1);
    }

    const handleSubmit = async () => {
        setFormError('');
        setLoadingSubmit(true);

        if (!product || !quantity) {
            setFormError('Please fill all required fields');
            setLoadingSubmit(false);
            return false;
        }

        try {
            const payload = {
                'product_id': product,
                'quantity': quantity
            }
            const response = await orderItemsService.updateOrderItem(id, payload);
            return true;
        } catch (error) {
            enqueueSnackbar(error || 'Failed to update order item', { variant: 'error' });
            console.error(error);
            return false;
        } finally {
            setLoadingSubmit(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoadingFetch(true);
            await getProducts();
            await getOrderItem();
            setLoadingFetch(false);
        }

        fetchData();
    }, []);

    return (
        <MainLayout>
            {loadingFetch ? <Spinner/> : (
                <UpdateForm
                    title='Update Order Item'
                    inputs={inputs}
                    link={`/orders`}
                    loading={loadingSubmit}
                    formError={formError}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                />
            )}
        </MainLayout>
    )
}

export default UpdateOrderItem