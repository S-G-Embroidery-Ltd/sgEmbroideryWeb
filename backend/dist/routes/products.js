"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const router = express_1.default.Router();
// Get all products
router.get('/', async (req, res) => {
    try {
        console.log('📦 Products API called with query:', req.query);
        const { page, limit, category, search, inStock, minPrice, maxPrice, featured } = req.query;
        // Check database connection
        if (mongoose_1.default.connection.readyState !== 1) {
            console.error('❌ Database not connected, connection state:', mongoose_1.default.connection.readyState);
            return res.status(503).json({
                success: false,
                message: 'Database connection unavailable'
            });
        }
        const filter = {};
        if (category && category !== 'all') {
            filter.category = category;
            console.log('🔍 Category filter:', category);
        }
        if (inStock !== undefined) {
            const inStockStr = String(inStock);
            const inStockBool = inStockStr === 'true' || inStockStr === '1';
            filter.inStock = inStockBool;
            console.log('🔍 InStock filter:', inStock, '→', inStockBool);
        }
        if (featured === 'true') {
            filter.featured = true;
            console.log('🔍 Featured filter: true');
        }
        if (search) {
            filter.$text = { $search: search };
            console.log('🔍 Search filter:', search);
        }
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = Number(minPrice);
                console.log('🔍 Min price filter:', minPrice);
            }
            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
                console.log('🔍 Max price filter:', maxPrice);
            }
        }
        console.log('🔍 Final filter object:', filter);
        // Only use pagination if explicitly requested
        if (page && limit) {
            const products = await Product_1.default.find(filter)
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit))
                .sort({ createdAt: -1 });
            const total = await Product_1.default.countDocuments(filter);
            res.json({
                success: true,
                data: products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });
        }
        else {
            // Return all products without pagination
            console.log('🔍 Executing product query with filter...');
            let products;
            try {
                products = await Product_1.default.find(filter)
                    .sort({ createdAt: -1 })
                    .maxTimeMS(10000); // 10 second timeout
                console.log('✅ Found', products.length, 'products');
            }
            catch (dbError) {
                console.error('❌ Database query error:', dbError);
                return res.status(500).json({
                    success: false,
                    message: 'Database query failed: ' + (dbError instanceof Error ? dbError.message : 'Unknown error')
                });
            }
            // If no products found, return sample products
            if (products.length === 0) {
                console.log('📦 No products found, returning sample products...');
                const sampleProducts = [
                    {
                        _id: 'sample1',
                        name: 'Custom Embroidered Polo Shirt',
                        description: 'High-quality polo shirt with custom embroidery. Perfect for corporate uniforms and team wear.',
                        price: 2500,
                        category: 'physical',
                        images: ['/images/polo-shirt.jpg'],
                        inStock: true,
                        featured: true,
                        tags: ['polo', 'embroidery', 'custom', 'corporate'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        _id: 'sample2',
                        name: 'Corporate Uniform Package',
                        description: 'Complete corporate uniform set with professional embroidery. Includes shirt, pants, and accessories.',
                        price: 5000,
                        category: 'physical',
                        images: ['/images/corporate-uniform.jpg'],
                        inStock: true,
                        featured: true,
                        tags: ['corporate', 'uniform', 'package', 'professional'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        _id: 'sample3',
                        name: 'Embroidered Cap',
                        description: 'Premium quality cap with custom embroidery design. Great for promotions and casual wear.',
                        price: 800,
                        category: 'physical',
                        images: ['/images/embroidered-cap.jpg'],
                        inStock: true,
                        featured: false,
                        tags: ['cap', 'embroidery', 'accessories', 'promotional'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        _id: 'sample4',
                        name: 'Custom Embroidered T-Shirt',
                        description: 'Comfortable cotton t-shirt with professional embroidery. Ideal for events and casual wear.',
                        price: 1200,
                        category: 'physical',
                        images: ['/images/embroidered-tshirt.jpg'],
                        inStock: true,
                        featured: false,
                        tags: ['tshirt', 'embroidery', 'casual', 'events'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        _id: 'sample5',
                        name: 'Embroidered Jacket',
                        description: 'Premium jacket with custom embroidery. Perfect for corporate events and team building.',
                        price: 4500,
                        category: 'physical',
                        images: ['/images/embroidered-jacket.jpg'],
                        inStock: true,
                        featured: true,
                        tags: ['jacket', 'embroidery', 'corporate', 'premium'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        _id: 'sample6',
                        name: 'Embroidered Bag',
                        description: 'Sturdy bag with custom embroidery design. Great for promotions and daily use.',
                        price: 1500,
                        category: 'physical',
                        images: ['/images/embroidered-bag.jpg'],
                        inStock: true,
                        featured: false,
                        tags: ['bag', 'embroidery', 'accessories', 'promotional'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ];
                return res.json({
                    success: true,
                    data: sampleProducts
                });
            }
            res.json({
                success: true,
                data: products
            });
        }
    }
    catch (error) {
        console.error('❌ Products API error:', error);
        console.error('❌ Error stack:', error.stack);
        // Handle specific error types
        if (error.name === 'MongoTimeoutError') {
            return res.status(503).json({
                success: false,
                message: 'Database timeout. Please try again.'
            });
        }
        if (error.name === 'MongoError' && error.message.includes('connection')) {
            return res.status(503).json({
                success: false,
                message: 'Database connection error. Please try again later.'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get products',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
// Get featured products (must be before /:id)
router.get('/featured/list', async (_req, res) => {
    try {
        console.log('📦 Featured products API called');
        // Check database connection
        if (mongoose_1.default.connection.readyState !== 1) {
            console.error('❌ Database not connected for featured products');
            return res.status(503).json({
                success: false,
                message: 'Database connection unavailable'
            });
        }
        const products = await Product_1.default.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .maxTimeMS(5000); // 5 second timeout for featured products
        console.log('✅ Found', products.length, 'featured products');
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        console.error('❌ Featured products API error:', error);
        // Handle specific error types
        if (error.name === 'MongoTimeoutError') {
            return res.status(503).json({
                success: false,
                message: 'Database timeout. Please try again.'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get featured products'
        });
    }
});
// Search products (must be before /:id)
router.get('/search/query', async (req, res) => {
    try {
        const { q, category } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        const query = {
            $text: { $search: q },
        };
        if (category && category !== 'all') {
            query.category = category;
        }
        const products = await Product_1.default.find(query)
            .sort({ score: { $meta: 'textScore' } })
            .limit(20);
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to search products'
        });
    }
});
// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get product'
        });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map