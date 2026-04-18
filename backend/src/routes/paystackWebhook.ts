import { Router } from 'express';
import crypto from 'crypto';
import { markOrderPaidFromPaystack, markOrderPaystackFailed } from '../services/orderPayment';

const router = Router();

/**
 * Paystack webhook — body is raw Buffer (see `index.ts` middleware).
 */
router.post('/', async (req, res) => {
  try {
    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).send('Expected raw body');
    }

    const hash = req.headers['x-paystack-signature'] as string | undefined;
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET?.trim();

    if (secret && hash) {
      const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
      if (hash !== expected) {
        return res.status(401).send('Invalid signature');
      }
    }

    let event: { event?: string; data?: Record<string, unknown> };
    try {
      event = JSON.parse(rawBody.toString('utf8')) as { event?: string; data?: Record<string, unknown> };
    } catch {
      return res.status(400).send('Invalid JSON');
    }

    if (event.event === 'charge.success') {
      const paymentData = event.data as {
        metadata?: { orderId?: string; order_id?: string };
        reference?: string;
        amount?: number;
        paid_at?: string;
      };
      const orderId = paymentData.metadata?.orderId ?? paymentData.metadata?.order_id;
      if (orderId) {
        await markOrderPaidFromPaystack(String(orderId), {
          reference: paymentData.reference,
          amountMinor: paymentData.amount,
          paidAt: paymentData.paid_at,
        });
      }
    } else if (event.event === 'charge.failed') {
      const paymentData = event.data as { metadata?: { orderId?: string; order_id?: string } };
      const orderId = paymentData.metadata?.orderId ?? paymentData.metadata?.order_id;
      if (orderId) {
        await markOrderPaystackFailed(String(orderId));
      }
    }

    res.status(200).send('OK');
  } catch (error: unknown) {
    console.error('[paystack webhook]', error);
    res.status(500).send('Error');
  }
});

export default router;
