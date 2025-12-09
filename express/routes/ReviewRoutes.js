import express from 'express';
import { 
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
 } from "../controllers/ReviewController.js";

const reviewRoutes = express.Router();

// Review Routes
// Get all products
reviewRoutes.get('/', getAllReviews);

// Get a single product by ID
reviewRoutes.get('/:id', getReviewById);

// Create a new product
reviewRoutes.post('/', createReview);

// Update an existing product
reviewRoutes.put('/:id', updateReview);

// Delete a product
reviewRoutes.delete('/:id', deleteReview);

export default reviewRoutes;
