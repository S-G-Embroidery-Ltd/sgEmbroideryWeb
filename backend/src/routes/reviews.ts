import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Review from '../models/Review';
import Product from '../models/Product';
import Order from '../models/Order';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit, skip, rating } = req.query;

    const query: any = { productId };
    if (rating) {
      query.rating = parseInt(rating as string);
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit as string) : 20)
      .skip(skip ? parseInt(skip as string) : 0);

    const total = await Review.countDocuments(query);

    // Calculate average rating
    const allReviews = await Review.find({ productId });
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    res.json({
      success: true,
      data: reviews,
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: allReviews.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId, orderId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'Product ID, rating, and comment are required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId: req.user.userId, productId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if order exists and belongs to user (if orderId provided)
    let verifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
      if (order) {
        verifiedPurchase = true;
      }
    }

    const review = await Review.create({
      userId: req.user.userId,
      productId,
      orderId,
      rating,
      title,
      comment,
      verifiedPurchase,
    });

    // Update product review aggregations
    await updateProductReviewAggregations(productId);

    const populatedReview = await Review.findById(review._id).populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a review
router.put('/:reviewId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure user can only update their own reviews
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = rating;
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: updateData },
      { new: true }
    ).populate('userId', 'name avatar');

    // Update product review aggregations
    await updateProductReviewAggregations(review.productId.toString());

    res.json({
      success: true,
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:reviewId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure user can only delete their own reviews
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const productId = review.productId.toString();
    await Review.findByIdAndDelete(reviewId);

    // Update product review aggregations
    await updateProductReviewAggregations(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reviews
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { userId } = req.params;

    // Ensure user can only view their own reviews
    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reviews = await Review.find({ userId })
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update product review aggregations
async function updateProductReviewAggregations(productId: string) {
  const reviews = await Review.find({ productId });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });
}

export default router;
