"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Add to favorites (protected)
router.post('/favorites', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        // Check if product exists
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Add to favorites
        await User_1.default.findByIdAndUpdate(req.user.userId, { $addToSet: { favorites: productId } }, { new: true });
        res.json({ message: 'Product added to favorites' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Remove from favorites (protected)
router.delete('/favorites/:productId', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { productId } = req.params;
        // Remove from favorites
        await User_1.default.findByIdAndUpdate(req.user.userId, { $pull: { favorites: productId } }, { new: true });
        res.json({ message: 'Product removed from favorites' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get user favorites (protected)
router.get('/favorites', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User_1.default.findById(req.user.userId).populate({
            path: 'favorites',
            model: 'Product',
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ favorites: user.favorites });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update user profile (protected)
router.patch('/profile', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { name } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user.userId, { name }, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map