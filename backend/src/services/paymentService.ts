import Payment, { IPayment } from '../models/Payment';
import Order from '../models/Order';

export interface PaymentAnalytics {
  totalRevenue: number;
  totalPayments: number;
  completedPayments: number;
  failedPayments: number;
  refundedPayments: number;
  successRate: number;
  refundRate: number;
  paymentMethodBreakdown: {
    [key: string]: {
      count: number;
      amount: number;
      percentage: number;
    };
  };
  dailyRevenue: Array<{
    date: string;
    amount: number;
    count: number;
  }>;
}

export interface CreatePaymentInput {
  userId: string;
  orderId: string;
  amount: number;
  currency?: string;
  paymentMethod: 'paystack' | 'mpesa' | 'card' | 'bank_transfer';
  paymentChannel: 'paystack' | 'mpesa_manual';
  transactionId?: string;
  paystackReference?: string;
  mpesaTransactionCode?: string;
  metadata?: any;
}

export interface RefundInput {
  refundAmount: number;
  refundReason: string;
  refundedBy: string;
}

class PaymentService {
  /**
   * Create a new payment record
   */
  static async createPayment(input: CreatePaymentInput): Promise<IPayment> {
    const payment = await Payment.create({
      userId: input.userId,
      orderId: input.orderId,
      amount: input.amount,
      currency: input.currency || 'KES',
      paymentMethod: input.paymentMethod,
      paymentChannel: input.paymentChannel,
      transactionId: input.transactionId,
      paystackReference: input.paystackReference,
      mpesaTransactionCode: input.mpesaTransactionCode,
      metadata: input.metadata,
    });

    return payment;
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded'
  ): Promise<IPayment | null> {
    const updateData: any = { status };

    if (status === 'completed') {
      updateData.completedAt = new Date();
    } else if (status === 'failed') {
      updateData.failedAt = new Date();
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: updateData },
      { new: true }
    );

    return payment;
  }

  /**
   * Process a refund
   */
  static async processRefund(
    paymentId: string,
    refundInput: RefundInput
  ): Promise<IPayment | null> {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Can only refund completed payments');
    }

    const refundAmount = refundInput.refundAmount;
    const isFullRefund = refundAmount >= payment.amount;

    const updateData: any = {
      status: isFullRefund ? 'refunded' : 'partially_refunded',
      'refundInfo.refundAmount': refundAmount,
      'refundInfo.refundReason': refundInput.refundReason,
      'refundInfo.refundDate': new Date(),
      'refundInfo.refundedBy': refundInput.refundedBy,
    };

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: updateData },
      { new: true }
    );

    return updatedPayment;
  }

  /**
   * Get payment history for a user
   */
  static async getPaymentHistory(
    userId: string,
    options: {
      limit?: number;
      skip?: number;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<{ payments: IPayment[]; total: number }> {
    const query: any = { userId };

    if (options.status) {
      query.status = options.status;
    }

    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) {
        query.createdAt.$gte = options.startDate;
      }
      if (options.endDate) {
        query.createdAt.$lte = options.endDate;
      }
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('orderId', 'orderNumber total')
      .sort({ createdAt: -1 })
      .limit(options.limit || 20)
      .skip(options.skip || 0);

    return { payments, total };
  }

  /**
   * Get payment by order ID
   */
  static async getPaymentByOrderId(orderId: string): Promise<IPayment | null> {
    return await Payment.findOne({ orderId }).populate('userId', 'name email');
  }

  /**
   * Get payment analytics (admin)
   */
  static async getPaymentAnalytics(options: {
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<PaymentAnalytics> {
    const query: any = {};

    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) {
        query.createdAt.$gte = options.startDate;
      }
      if (options.endDate) {
        query.createdAt.$lte = options.endDate;
      }
    }

    const payments = await Payment.find(query);

    const totalRevenue = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPayments = payments.length;
    const completedPayments = payments.filter((p) => p.status === 'completed').length;
    const failedPayments = payments.filter((p) => p.status === 'failed').length;
    const refundedPayments = payments.filter(
      (p) => p.status === 'refunded' || p.status === 'partially_refunded'
    ).length;

    const successRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;
    const refundRate = completedPayments > 0 ? (refundedPayments / completedPayments) * 100 : 0;

    // Payment method breakdown
    const paymentMethodBreakdown: { [key: string]: { count: number; amount: number; percentage: number } } = {};
    payments.forEach((payment) => {
      const method = payment.paymentMethod;
      if (!paymentMethodBreakdown[method]) {
        paymentMethodBreakdown[method] = { count: 0, amount: 0, percentage: 0 };
      }
      paymentMethodBreakdown[method].count++;
      if (payment.status === 'completed') {
        paymentMethodBreakdown[method].amount += payment.amount;
      }
    });

    // Calculate percentages
    Object.keys(paymentMethodBreakdown).forEach((method) => {
      paymentMethodBreakdown[method].percentage =
        totalPayments > 0 ? (paymentMethodBreakdown[method].count / totalPayments) * 100 : 0;
    });

    // Daily revenue
    const dailyRevenueMap = new Map<string, { amount: number; count: number }>();
    payments
      .filter((p) => p.status === 'completed')
      .forEach((payment) => {
        const date = payment.createdAt.toISOString().split('T')[0];
        if (!dailyRevenueMap.has(date)) {
          dailyRevenueMap.set(date, { amount: 0, count: 0 });
        }
        const data = dailyRevenueMap.get(date)!;
        data.amount += payment.amount;
        data.count++;
      });

    const dailyRevenue = Array.from(dailyRevenueMap.entries())
      .map(([date, data]) => ({ date, amount: data.amount, count: data.count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue,
      totalPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      successRate,
      refundRate,
      paymentMethodBreakdown,
      dailyRevenue,
    };
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(paymentId: string): Promise<IPayment | null> {
    return await Payment.findById(paymentId)
      .populate('userId', 'name email')
      .populate('orderId', 'orderNumber total status');
  }
}

export default PaymentService;
