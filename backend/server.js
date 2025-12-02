import express from 'express';
import cors from 'cors';
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;
import mongoose from 'mongoose';
import dotenv from 'dotenv'
// Routes Imports
import authRoutes from './routes/AuthRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import reviewRoutes from './routes/ReviewRoutes.js';

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri)
.then(() => {
    console.log('Connected to MongoDB database');
})
.catch((error) => {
    console.error('Error connecting to MongoDB database:', error);
});

// CORS Middleware
app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
));

// // Routes
app.get('/', (req, res) => {
    res.json('This is ecommerce project api');
});
// Auth Routes
app.use('/api/auth', authRoutes);
// User Routes
app.use('/api/users', userRoutes);
// Category Routes
app.use('/api/categories', categoryRoutes);
// Product Routes
app.use('/api/products', productRoutes);
// Order Routes
app.use('/api/orders', orderRoutes);
// Review Routes
app.use('/api/reviews', reviewRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});