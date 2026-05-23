import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import { authMiddleware } from '../middleware/auth';
import { emailNewShopOrder, emailMpesaCodeSubmitted } from '../services/email';

const router = express.Router();

const TAX_RATE = 0.16;
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 300;

function computeOrderAmounts(items: { price: number; quantity: number }[], deliveryInfo?: any) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  
  // Use delivery info if provided, otherwise use standard shipping
  let shippingCost = STANDARD_SHIPPING;
  if (deliveryInfo && typeof deliveryInfo.finalCost === 'number') {
    shippingCost = deliveryInfo.finalCost;
  } else if (subtotal > FREE_SHIPPING_THRESHOLD) {
    shippingCost = 0;
  }
  
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

    const { items, shippingAddress, paymentChannel: rawChannel, deliveryInfo } = req.body;
    const paymentChannel =
      rawChannel === 'mpesa_manual' ? 'mpesa_manual' : 'paystack';

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
      lineItems.map((i: any) => ({ price: i.price, quantity: i.quantity })),
      deliveryInfo
    );

    const order = new Order({
      userId: req.user.userId,
      items: lineItems,
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress,
      paymentChannel,
      deliveryInfo,
    });

    await order.save();
    await order.populate('items.product');

    if (!order.orderType || order.orderType === 'standard') {
      void emailNewShopOrder(order).catch((e) => console.error('[email] new shop order:', e));
    }

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

// Submit M-Pesa confirmation code (Till / Buy Goods) — staff confirms via separate admin + internal API
router.post('/:id/mpesa-code', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const code = (req.body?.code ?? '').toString().trim().replace(/\s+/g, '');
    if (!code || code.length < 4) {
      return res.status(400).json({ message: 'Valid M-Pesa code is required' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if ((order.paymentChannel || 'paystack') !== 'mpesa_manual') {
      return res.status(400).json({ message: 'This order does not use M-Pesa manual payment' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    order.mpesaTransactionCode = code;
    order.mpesaSubmittedAt = new Date();
    order.paymentStatus = 'awaiting_manual_confirmation';
    await order.save();

    void emailMpesaCodeSubmitted(order, code).catch((e) => console.error('[email] mpesa code:', e));

    res.json({
      message: 'M-Pesa code received. We will verify your payment shortly.',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Receipt summary (JSON) for paid orders
router.get('/:id/receipt', authMiddleware, async (req, res) => {
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

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Order is not paid yet' });
    }

    res.json({
      orderNumber: order.orderNumber,
      paidAt: order.paidAt,
      total: order.total,
      paymentChannel: order.paymentChannel,
      paystackReference: order.paystackReference || order.paymentId,
      mpesaTransactionCode: order.mpesaTransactionCode,
      items: order.items,
      shippingAddress: order.shippingAddress,
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

// Admin routes for order management

// Get all orders (admin only)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // In a real app, check if user is admin here
    // For now, we'll allow authenticated users to view all orders
    
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    const query: any = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

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

// Update order delivery cost (admin only)
router.patch('/admin/:id/delivery', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { deliveryInfo } = req.body;
    
    if (!deliveryInfo) {
      return res.status(400).json({ message: 'Delivery information is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update delivery information
    order.deliveryInfo = deliveryInfo;
    
    // Recalculate total with new shipping cost
    const { subtotal, tax, shippingCost, total } = computeOrderAmounts(
      order.items.map((item: any) => ({ price: item.price, quantity: item.quantity })),
      deliveryInfo
    );

    order.shippingCost = shippingCost;
    order.total = total;
    
    await order.save();

    res.json({
      message: 'Order delivery information updated successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.patch('/admin/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { status, paymentStatus } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'awaiting_manual_confirmation', 'paid', 'failed', 'refunded'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status if provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get order statistics (admin only)
router.get('/admin/stats', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          processingOrders: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
          shippedOrders: { $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          paidOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
        },
      },
    ]);

    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // Last 365 days
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      summary: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        paidOrders: 0,
      },
      monthlyStats,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
