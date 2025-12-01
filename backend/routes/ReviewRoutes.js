import express from 'express';
import { 
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
 } from "../controllers/ReviewController.js";

const reviewRouter = express.Router();

// Review Routes
// Get all products
reviewRouter.get('/', getAllReviews);

// Get a single product by ID
reviewRouter.get('/:id', getReviewById);

// Create a new product
reviewRouter.post('/', createReview);

// Update an existing product
reviewRouter.put('/:id', updateReview);

// Delete a product
reviewRouter.delete('/:id', deleteReview);

export default reviewRouter;
