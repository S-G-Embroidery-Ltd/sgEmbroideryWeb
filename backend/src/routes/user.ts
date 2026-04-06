import express from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Add to favorites (protected)
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add to favorites
    await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { favorites: productId } },
      { new: true }
    );

    res.json({ message: 'Product added to favorites' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites (protected)
router.delete('/favorites/:productId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId } = req.params;

    // Remove from favorites
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { favorites: productId } },
      { new: true }
    );

    res.json({ message: 'Product removed from favorites' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get user favorites (protected)
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user.userId).populate({
      path: 'favorites',
      model: 'Product',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ favorites: user.favorites });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (protected)
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
