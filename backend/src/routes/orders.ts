import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

const TAX_RATE = 0.16;
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 300;

function computeOrderAmounts(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;
  return { subtotal, tax, shippingCost, total };
}

function isMongoId(value: unknown): value is string {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value) && value.length === 24;
}

// Create new order (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.phone
      || !shippingAddress?.address || !shippingAddress?.city
      || !shippingAddress?.country || !shippingAddress?.postalCode) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    const lineItems: Record<string, unknown>[] = [];
    for (const item of items as any[]) {
      const qty = Math.max(1, Math.floor(Number(item.quantity)) || 1);
      const price = Number(item.price);
      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Invalid item price' });
      }
      const name = (item.name || 'Product').toString().trim();
      const line: Record<string, unknown> = {
        name,
        quantity: qty,
        price,
        size: item.size,
        color: item.color,
        image: item.image,
      };
      const productRef = item.product ?? item.id;
      if (isMongoId(productRef)) {
        line.product = new mongoose.Types.ObjectId(productRef);
      }
      lineItems.push(line);
    }

    const { subtotal, tax, shippingCost, total } = computeOrderAmounts(
      lineItems.map((i: any) => ({ price: i.price, quantity: i.quantity }))
    );

    const order = new Order({
      userId: req.user.userId,
      items: lineItems,
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress,
    });

    await order.save();
    await order.populate('items.product');

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders (protected)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments({ userId: req.user.userId });

    res.json({
      orders,
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

// Get single order (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin route - for now, user can cancel their own orders)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if order is pending
    if (status === 'cancelled' && order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is not pending' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
