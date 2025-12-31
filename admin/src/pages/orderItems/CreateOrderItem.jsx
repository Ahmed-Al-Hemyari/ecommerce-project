import MainLayout from '@/components/Layouts/MainLayout';
import CreateForm from '@/components/UI/Forms/CreateForm';
import Spinner from '@/components/UI/Spinner';
import { orderItemsService } from '@/services/orderItemsService';
import productService from '@/services/productService';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CreateOrderItem = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Props
    const { orderId } = useParams();
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
        setLoadingFetch(true);
        try {
            const response = await productService.getProducts();
            console.log(response.data.products);
            setProducts(response.data.products);
        } catch (error) {
            enqueueSnackbar(error || "Failed to load products", {
            variant: 'error'
            });
            console.error(error)
        } finally {
            setLoadingFetch(false);
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
                'order_id': orderId,
                'quantity': quantity
            }
            const response = await orderItemsService.createOrderItem(payload);
            return true;
        } catch (error) {
            enqueueSnackbar(error || 'Failed to create order item', { variant: 'error' });
            console.error(error);
            return false;
        } finally {
            setLoadingSubmit(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <MainLayout>
            {loadingFetch ? <Spinner/> : (
                <CreateForm
                    title='Create Order Item'
                    inputs={inputs}
                    link={`/orders/show/${orderId}`}
                    loading={loadingSubmit}
                    formError={formError}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                />
            )}
        </MainLayout>
    )
}

export default CreateOrderItem