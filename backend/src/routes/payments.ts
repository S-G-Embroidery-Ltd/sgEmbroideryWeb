import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Order from '../models/Order';
import { getPrimarySiteUrl } from '../utils/corsOrigins';
import { markOrderPaidFromPaystack } from '../services/orderPayment';
import PaymentService from '../services/paymentService';

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

    if ((order.paymentChannel || 'paystack') === 'mpesa_manual') {
      return res.status(400).json({
        message: 'This order uses M-Pesa manual payment. Complete payment using the instructions shown, then submit your transaction code.',
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return res.status(500).json({ message: 'Paystack not configured' });
    }

    const amountMinor = Math.round(order.total * 100);
    if (amountMinor < 100) {
      return res.status(400).json({ message: 'Order total is too small to charge' });
    }

    const reference = `SG-${order.orderNumber}-${Date.now()}`;
    const site = getPrimarySiteUrl();

    const paystackData = {
      email,
      amount: amountMinor,
      currency: PAYSTACK_CURRENCY,
      reference,
      callback_url: `${site}/verify`,
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

    const data = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; reference: string };
    };

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

// Verify payment (browser return URL — no auth; do not trust client totals)
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

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: {
        status: string;
        amount: number;
        paid_at?: string;
        metadata?: { orderId?: string; order_id?: string };
        reference?: string;
      };
    };

    if (!data.status) {
      return res.status(400).json({ message: 'Payment verification failed', error: data.message });
    }

    const paymentData = data.data;
    if (!paymentData) {
      return res.status(400).json({ message: 'Invalid Paystack response' });
    }

    const meta = paymentData.metadata || {};
    const orderId = meta.orderId ?? meta.order_id;

    if (paymentData.status === 'success' && orderId) {
      const result = await markOrderPaidFromPaystack(String(orderId), {
        reference: paymentData.reference || reference,
        amountMinor: paymentData.amount,
        paidAt: paymentData.paid_at,
      });
      if (!result.ok) {
        return res.status(400).json({ message: 'Could not update order', reason: result.reason });
      }

      return res.json({
        message: result.alreadyPaid ? 'Payment already recorded' : 'Payment verified successfully',
        status: paymentData.status,
        amount: paymentData.amount != null ? paymentData.amount / 100 : undefined,
        paidAt: paymentData.paid_at,
        orderId: String(orderId),
        alreadyPaid: result.alreadyPaid,
      });
    }

    res.json({
      message: 'Payment verified',
      status: paymentData.status,
      amount: paymentData.amount != null ? paymentData.amount / 100 : undefined,
      paidAt: paymentData.paid_at,
      orderId: orderId ? String(orderId) : undefined,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment history for authenticated user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { limit, skip, status, startDate, endDate } = req.query;

    const options: any = {
      limit: limit ? parseInt(limit as string) : 20,
      skip: skip ? parseInt(skip as string) : 0,
    };

    if (status) {
      options.status = status;
    }

    if (startDate) {
      options.startDate = new Date(startDate as string);
    }

    if (endDate) {
      options.endDate = new Date(endDate as string);
    }

    const result = await PaymentService.getPaymentHistory(req.user.userId, options);

    res.json({
      success: true,
      data: result.payments,
      total: result.total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment analytics (admin only)
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // TODO: Add admin role check here
    const { startDate, endDate } = req.query;

    const options: any = {};
    if (startDate) {
      options.startDate = new Date(startDate as string);
    }
    if (endDate) {
      options.endDate = new Date(endDate as string);
    }

    const analytics = await PaymentService.getPaymentAnalytics(options);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment details
router.get('/:paymentId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { paymentId } = req.params;
    const paymentIdStr = Array.isArray(paymentId) ? paymentId[0] : paymentId;
    const payment = await PaymentService.getPaymentDetails(paymentIdStr);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Ensure user can only view their own payments
    if (payment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Process refund (admin only)
router.post('/:paymentId/refund', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // TODO: Add admin role check here
    const { paymentId } = req.params;
    const paymentIdStr = Array.isArray(paymentId) ? paymentId[0] : paymentId;
    const { refundAmount, refundReason } = req.body;

    if (!refundAmount || !refundReason) {
      return res.status(400).json({ message: 'Refund amount and reason are required' });
    }

    const result = await PaymentService.processRefund(paymentIdStr, {
      refundAmount,
      refundReason,
      refundedBy: req.user.userId,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
