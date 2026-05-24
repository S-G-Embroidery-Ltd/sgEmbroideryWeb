import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('📦 Products API called with query:', req.query);
    
    const { page, limit, category, search, inStock, minPrice, maxPrice, featured } = req.query
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected, connection state:', mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable'
      });
    }
    
    const filter: any = {}
    
    if (category && category !== 'all') {
      filter.category = category
      console.log('🔍 Category filter:', category);
    }
    
    if (inStock !== undefined) {
      const inStockStr = String(inStock);
      const inStockBool = inStockStr === 'true' || inStockStr === '1';
      filter.inStock = inStockBool
      console.log('🔍 InStock filter:', inStock, '→', inStockBool);
    }
    
    if (featured === 'true') {
      filter.featured = true
      console.log('🔍 Featured filter: true');
    }
    
    if (search) {
      filter.$text = { $search: search as string }
      console.log('🔍 Search filter:', search);
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) {
        filter.price.$gte = Number(minPrice)
        console.log('🔍 Min price filter:', minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice)
        console.log('🔍 Max price filter:', maxPrice);
      }
    }
    
    console.log('🔍 Final filter object:', filter);
    
    // Only use pagination if explicitly requested
    if (page && limit) {
      const products = await Product.find(filter)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 })
      
      const total = await Product.countDocuments(filter)
      
      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } else {
      // Return all products without pagination
      console.log('🔍 Executing product query with filter...');
      let products;
      
      try {
        products = await Product.find(filter)
          .sort({ createdAt: -1 })
          .maxTimeMS(10000); // 10 second timeout
        
        console.log('✅ Found', products.length, 'products');
      } catch (dbError) {
        console.error('❌ Database query error:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Database query failed: ' + (dbError instanceof Error ? dbError.message : 'Unknown error')
        });
      }
      
      // If no products found, return empty array
      if (products.length === 0) {
        console.log('📦 No products found, returning empty array');
        return res.json({
          success: true,
          data: []
        });
      }
      
      res.json({
        success: true,
        data: products
      })
    }
  } catch (error: any) {
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
    })
  }
});

// Get featured products (must be before /:id)
router.get('/featured/list', async (_req, res) => {
  try {
    console.log('📦 Featured products API called');
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected for featured products');
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable'
      });
    }
    
    // Try to get featured products first
    let products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .maxTimeMS(5000); // 5 second timeout for featured products
    
    console.log('✅ Found', products.length, 'featured products');
    
    // If we don't have at least 3 featured products, get random products to fill
    if (products.length < 3) {
      console.log('🔄 Not enough featured products, getting random products to fill');
      
      // Get random products that are in stock
      const randomProducts = await Product.find({ 
        inStock: true,
        _id: { $nin: products.map(p => p._id) } // Exclude already selected products
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .maxTimeMS(5000);
      
      // Shuffle and take enough products to reach 3 total
      const shuffled = randomProducts.sort(() => Math.random() - 0.5);
      const needed = 3 - products.length;
      const additionalProducts = shuffled.slice(0, needed);
      
      products = [...products, ...additionalProducts];
      console.log('✅ Added', additionalProducts.length, 'random products, total:', products.length);
    }
    
    // If still no products (empty database), return empty array
    if (products.length === 0) {
      console.log('📦 No products in database, returning empty array');
      products = [];
    }
    
    // Shuffle the final selection to ensure randomness
    const shuffledProducts = products.sort(() => Math.random() - 0.5);
    
    res.json({
      success: true,
      data: shuffledProducts
    });
  } catch (error: any) {
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

    const query: Record<string, unknown> = {
      $text: { $search: q as string },
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get product'
    });
  }
});

export default router;
