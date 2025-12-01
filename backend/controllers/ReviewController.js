import Review from "../models/Review";
import User from "../models/User.js";
import Product from "../models/Product.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user').populate('product');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user').populate('product');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new review
export const createReview = async (req, res) => {
    try {
        // Check required fields
        if (!req.body.user || !req.body.product || !req.body.rating) {   
            return res.status(400).json({ message: 'User, Product, and Rating are required' });
        }

        // Validate user and product existence
        const user = await User.findById(req.body.user);
        const product = await Product.findById(req.body.product);
        
        if(!user)
        {
            return res.status(400).json({ message: 'Invalid user' });
        }
        if(!product)
        {
            return res.status(400).json({ message: 'Invalid product' });
        }

        // Validate rating range
        if(req.body.rating < 1 || req.body.rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Create and save the new review
        const newReview = Review({
            user: req.body.user,
            product: req.body.product,
            rating: req.body.rating,
            comment: req.body.comment || ''
        });
        const review = await Review.create(newReview);
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an existing review
export const updateReview = async (req, res) => {
  try {
    const newData = {};
    if (req.body.rating) { 
        if(req.body.rating < 1 || req.body.rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        newData.rating = req.body.rating;
    }
    if (req.body.comment) newData.comment = req.body.comment;

    // Validate user and product existence
    const user = await User.findById(req.body.user);
    const product = await Product.findById(req.body.product);
    
    if(!user)
    {
        return res.status(400).json({ message: 'Invalid user' });
    }
    if(!product)
    {
        return res.status(400).json({ message: 'Invalid product' });
    }

    // Update Review
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      newData,
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};