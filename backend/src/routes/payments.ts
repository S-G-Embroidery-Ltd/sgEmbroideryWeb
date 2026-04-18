import express from 'express';
import crypto from 'crypto';
import { authMiddleware } from '../middleware/auth';
import Order from '../models/Order';

const router = express.Router();

const PAYSTACK_CURRENCY = process.env.PAYSTACK_CURRENCY || 'KES';

// Initialize Paystack payment (amount is taken from the order record — do not trust client totals)
router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).json({ message: 'Order ID and customer email are required' });
    }

    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return res.status(500).json({ message: 'Paystack not configured' });
    }

    // Smallest currency unit (KES: 2 decimal places → multiply by 100)
    const amountMinor = Math.round(order.total * 100);
    if (amountMinor < 100) {
      return res.status(400).json({ message: 'Order total is too small to charge' });
    }

    const reference = `SG-${order.orderNumber}-${Date.now()}`;

    const paystackData = {
      email,
      amount: amountMinor,
      currency: PAYSTACK_CURRENCY,
      reference,
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/verify`,
      metadata: {
        orderId: String(order._id),
        userId: String(req.user.userId),
        orderNumber: order.orderNumber,
      },
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData),
    });

    const data = (await response.json()) as { status: boolean; message?: string; data?: { authorization_url: string; reference: string } };

    if (!data.status || !data.data) {
      return res.status(400).json({ message: 'Payment initialization failed', error: data.message });
    }

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
    const meta = paymentData.metadata || {};
    const orderId = meta.orderId ?? meta.order_id;

    if (paymentData.status === 'success' && orderId) {
      await Order.findByIdAndUpdate(String(orderId), {
        paymentStatus: 'paid',
        status: 'processing',
      });
    }

    res.json({
      message: 'Payment verified successfully',
      status: paymentData.status,
      amount: paymentData.amount / 100,
      paidAt: paymentData.paid_at,
      orderId: orderId ? String(orderId) : undefined,
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
      const expectedHash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== expectedHash) {
        return res.status(401).json({ message: 'Invalid webhook signature' });
      }
    }

    if (event.event === 'charge.success') {
      const paymentData = event.data;
      const orderId = paymentData.metadata?.orderId ?? paymentData.metadata?.order_id;
      if (orderId) {
        await Order.findByIdAndUpdate(String(orderId), {
          paymentStatus: 'paid',
          status: 'processing',
        });
        console.log(`Payment successful for order ${orderId}`);
      }
    } else if (event.event === 'charge.failed') {
      const paymentData = event.data;
      const orderId = paymentData.metadata?.orderId ?? paymentData.metadata?.order_id;
      if (orderId) {
        await Order.findByIdAndUpdate(String(orderId), {
          paymentStatus: 'failed',
        });
        console.log(`Payment failed for order ${orderId}`);
      }
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
