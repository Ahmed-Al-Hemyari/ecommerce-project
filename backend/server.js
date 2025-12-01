import express from 'express';
import cors from 'cors';
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;
import mongoose from 'mongoose';
import dotenv from 'dotenv'
// Routes Imports
import productRoutes from './routes/ProductRoutes.js';

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB database');
})
.catch((error) => {
    console.error('Error connecting to MongoDB database:', error);
});

// // Routes
app.get('/', (req, res) => {
    res.json({ msg: 'Hello World!' });
});
// Product Routes
app.use('/api/products', productRoutes);


// CORS Middleware
app.use(cors());

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});