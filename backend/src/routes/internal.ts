import express from 'express';
import Order from '../models/Order';
import { emailOrderPaidReceipt } from '../services/email';

const router = express.Router();

function assertAdminKey(req: express.Request, res: express.Response): boolean {
  const expected = process.env.INTERNAL_ADMIN_API_KEY?.trim();
  const got = (req.headers['x-internal-admin-key'] || req.headers['x-admin-key'] || '') as string;
  if (!expected || got !== expected) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
  return true;
}

/**
 * Called from your separate admin backend after you verify the M-Pesa transaction.
 * PATCH /api/internal/orders/:orderNumber/confirm-mpesa
 */
router.patch('/orders/:orderNumber/confirm-mpesa', async (req, res) => {
  try {
    if (!assertAdminKey(req, res)) return;

    const orderNumber = req.params.orderNumber.trim();
    const order = await Order.findOne({
      orderNumber,
      paymentChannel: 'mpesa_manual',
      paymentStatus: 'awaiting_manual_confirmation',
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found or not awaiting M-Pesa confirmation',
      });
    }

    order.paymentStatus = 'paid';
    order.status = 'processing';
    order.paidAt = new Date();
    await order.save();

    if (!order.receiptEmailedAt) {
      await emailOrderPaidReceipt(order, order.mpesaTransactionCode || 'M-Pesa');
      order.receiptEmailedAt = new Date();
      await order.save();
    }

    res.json({ message: 'Order marked paid', orderNumber: order.orderNumber });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed';
    res.status(500).json({ message: msg });
  }
});

export default router;
