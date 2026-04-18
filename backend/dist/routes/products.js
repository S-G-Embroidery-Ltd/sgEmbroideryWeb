"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const router = express_1.default.Router();
// Get featured products (must be before /:id)
router.get('/featured/list', async (_req, res) => {
    try {
        const products = await Product_1.default.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Search products (must be before /:id)
router.get('/search/query', async (req, res) => {
    try {
        const { q, category } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
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
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get all products with filtering
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, featured, search, page = 1, limit = 20, } = req.query;
        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (featured === 'true') {
            query.featured = true;
        }
        if (search) {
            query.$text = { $search: search };
        }
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const products = await Product_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        const total = await Product_1.default.countDocuments(query);
        res.json({
            products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map