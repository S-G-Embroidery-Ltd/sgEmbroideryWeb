import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const router = express.Router();

// Seed products endpoint (for development)
router.post('/products', async (req, res) => {
  try {
    console.log('🌱 Seeding products...');
    
    const sampleProducts = [
      {
        name: 'Custom Embroidered Polo Shirt',
        description: 'Premium quality polo shirt with custom embroidery. Perfect for corporate events, team uniforms, and promotional wear. Made from high-quality cotton blend with professional embroidery.',
        price: 2500,
        category: 'physical',
        images: ['/images/polo-shirt.jpg'],
        inStock: true,
        featured: true,
        tags: ['polo', 'embroidery', 'custom', 'corporate', 'uniform'],
      },
      {
        name: 'Corporate Uniform Package',
        description: 'Complete corporate uniform package with professional embroidery. Includes shirt, trousers, and accessories. Ideal for businesses looking for a professional appearance.',
        price: 5500,
        category: 'physical',
        images: ['/images/corporate-uniform.jpg'],
        inStock: true,
        featured: true,
        tags: ['corporate', 'uniform', 'package', 'professional', 'business'],
      },
      {
        name: 'Embroidered Cap',
        description: 'Stylish cap with custom embroidery design. Great for promotions, casual wear, and brand visibility. High-quality materials with durable embroidery.',
        price: 1200,
        category: 'physical',
        images: ['/images/embroidered-cap.jpg'],
        inStock: true,
        featured: false,
        tags: ['cap', 'embroidery', 'accessories', 'promotional', 'casual'],
      },
      {
        name: 'Embroidered T-Shirt',
        description: 'Comfortable t-shirt with custom embroidery. Perfect for casual events, team building, and everyday wear. Soft fabric with detailed embroidery work.',
        price: 1800,
        category: 'physical',
        images: ['/images/embroidered-tshirt.jpg'],
        inStock: true,
        featured: true,
        tags: ['tshirt', 'embroidery', 'casual', 'events', 'comfortable'],
      },
      {
        name: 'Embroidered Jacket',
        description: 'Premium jacket with custom embroidery. Perfect for corporate events, team building, and professional appearances. High-quality material with detailed embroidery.',
        price: 4500,
        category: 'physical',
        images: ['/images/embroidered-jacket.jpg'],
        inStock: true,
        featured: false,
        tags: ['jacket', 'embroidery', 'corporate', 'premium', 'professional'],
      },
      {
        name: 'Embroidered Bag',
        description: 'Sturdy bag with custom embroidery design. Great for promotions, daily use, and brand awareness. Durable construction with quality embroidery.',
        price: 1500,
        category: 'physical',
        images: ['/images/embroidered-bag.jpg'],
        inStock: true,
        featured: false,
        tags: ['bag', 'embroidery', 'accessories', 'promotional', 'durable'],
      },
      {
        name: 'Embroidered Hoodie',
        description: 'Comfortable hoodie with custom embroidery. Perfect for casual wear, team events, and brand promotion. Soft fabric with professional embroidery.',
        price: 2800,
        category: 'physical',
        images: ['/images/embroidered-hoodie.jpg'],
        inStock: true,
        featured: true,
        tags: ['hoodie', 'embroidery', 'casual', 'comfortable', 'team'],
      },
      {
        name: 'Embroidered Sports Jersey',
        description: 'Professional sports jersey with custom embroidery and numbering. Perfect for teams, clubs, and sports events. Moisture-wicking fabric with durable embroidery.',
        price: 3200,
        category: 'physical',
        images: ['/images/embroidered-jersey.jpg'],
        inStock: true,
        featured: false,
        tags: ['jersey', 'sports', 'embroidery', 'team', 'professional'],
      },
    ];

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Mark first 4 as featured
    await Product.updateMany(
      { _id: { $in: insertedProducts.slice(0, 4).map(p => p._id) } },
      { featured: true }
    );
    console.log('✅ Marked first 4 products as featured');

    // Get all products to return
    const allProducts = await Product.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      products: allProducts,
    });
  } catch (error: any) {
    console.error('❌ Error seeding products:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed products',
    });
  }
});

export default router;
