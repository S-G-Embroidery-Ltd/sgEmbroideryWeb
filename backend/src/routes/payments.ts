import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Order from '../models/Order';

const router = express.Router();

// Initialize Paystack payment
router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId, email, amount } = req.body;

    if (!orderId || !email || !amount) {
      return res.status(400).json({ message: 'Order ID, email, and amount are required' });
    }

    // Verify order belongs to user
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Paystack initialization
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return res.status(500).json({ message: 'Paystack not configured' });
    }

    const paystackData = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo (cents)
      reference: `SG-${order.orderNumber}-${Date.now()}`,
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
      metadata: {
        orderId: order._id,
        userId: req.user.userId,
      },
    };

    // Make request to Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData),
    });

    const data = await response.json() as any;

    if (!data.status) {
      return res.status(400).json({ message: 'Payment initialization failed', error: data.message });
    }

    // Update order with payment reference
    order.paymentId = data.data.reference;
    await order.save();

    res.json({
      message: 'Payment initialized successfully',
      paymentUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return res.status(500).json({ message: 'Paystack not configured' });
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json() as any;

    if (!data.status) {
      return res.status(400).json({ message: 'Payment verification failed', error: data.message });
    }

    const paymentData = data.data;

    // Update order status if payment was successful
    if (paymentData.status === 'success') {
      const orderId = paymentData.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'processing',
      });
    }

    res.json({
      message: 'Payment verified successfully',
      status: paymentData.status,
      amount: paymentData.amount / 100, // Convert back to main currency
      paidAt: paymentData.paid_at,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook for Paystack notifications
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature (optional but recommended)
    const hash = req.headers['x-paystack-signature'] as string;
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
    
    if (secret && hash) {
      const crypto = require('crypto');
      const expectedHash = crypto.createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== expectedHash) {
        return res.status(401).json({ message: 'Invalid webhook signature' });
      }
    }

    // Handle different event types
    if (event.event === 'charge.success') {
      const paymentData = event.data;
      const orderId = paymentData.metadata.orderId;

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'processing',
      });

      console.log(`Payment successful for order ${orderId}`);
    } else if (event.event === 'charge.failed') {
      const paymentData = event.data;
      const orderId = paymentData.metadata.orderId;

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
      });

      console.log(`Payment failed for order ${orderId}`);
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
