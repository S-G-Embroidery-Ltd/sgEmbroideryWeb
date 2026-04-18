import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Get featured products (must be before /:id)
router.get('/featured/list', async (_req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(products);
  } catch (error: any) {
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

    const query: Record<string, unknown> = {
      $text: { $search: q as string },
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query: Record<string, unknown> = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {} as Record<string, number>;
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
