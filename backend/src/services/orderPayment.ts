import Order from '../models/Order';
import { emailOrderPaidReceipt } from './email';

export type MarkPaidResult = { ok: true; alreadyPaid: boolean } | { ok: false; reason: string };

/**
 * Atomically mark order paid from Paystack (verify or webhook). Sends receipt email once.
 */
export async function markOrderPaidFromPaystack(
  orderId: string,
  opts: {
    reference?: string;
    amountMinor?: number;
    paidAt?: string | number;
  }
): Promise<MarkPaidResult> {
  if (!orderId) return { ok: false, reason: 'missing_order_id' };

  const paidAtDate =
    opts.paidAt != null ? new Date(typeof opts.paidAt === 'number' ? opts.paidAt * 1000 : opts.paidAt) : new Date();

  const update: Record<string, unknown> = {
    paymentStatus: 'paid',
    status: 'processing',
    paidAt: paidAtDate,
  };
  if (opts.reference) {
    update.paymentId = opts.reference;
    update.paystackReference = opts.reference;
  }
  if (opts.amountMinor != null) {
    update.paystackAmount = opts.amountMinor / 100;
  }

  const updated = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $ne: 'paid' } },
    { $set: update },
    { new: true }
  );

  if (!updated) {
    const existing = await Order.findById(orderId).lean();
    if (existing?.paymentStatus === 'paid') {
      return { ok: true, alreadyPaid: true };
    }
    return { ok: false, reason: 'order_not_found' };
  }

  if (!updated.receiptEmailedAt) {
    await emailOrderPaidReceipt(updated, opts.reference);
    await Order.updateOne({ _id: orderId }, { $set: { receiptEmailedAt: new Date() } });
  }

  return { ok: true, alreadyPaid: false };
}

export async function markOrderPaystackFailed(orderId: string): Promise<void> {
  await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $nin: ['paid', 'refunded'] } },
    { $set: { paymentStatus: 'failed' } }
  );
}
