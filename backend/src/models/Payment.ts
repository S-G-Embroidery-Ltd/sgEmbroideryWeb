import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: 'paystack' | 'mpesa' | 'card' | 'bank_transfer';
  paymentChannel: 'paystack' | 'mpesa_manual';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  transactionId?: string;
  paystackReference?: string;
  mpesaTransactionCode?: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    [key: string]: any;
  };
  refundInfo?: {
    refundId?: string;
    refundAmount?: number;
    refundReason?: string;
    refundDate?: Date;
    refundedBy?: mongoose.Types.ObjectId;
  };
  completedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      required: true,
      default: 'KES',
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['paystack', 'mpesa', 'card', 'bank_transfer'],
    },
    paymentChannel: {
      type: String,
      required: true,
      enum: ['paystack', 'mpesa_manual'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paystackReference: {
      type: String,
      trim: true,
    },
    mpesaTransactionCode: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    refundInfo: {
      refundId: String,
      refundAmount: Number,
      refundReason: String,
      refundDate: Date,
      refundedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    completedAt: Date,
    failedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentChannel: 1 });
paymentSchema.index({ transactionId: 1 }, { sparse: true });
paymentSchema.index({ paystackReference: 1 }, { sparse: true });
paymentSchema.index({ mpesaTransactionCode: 1 }, { sparse: true });

export default mongoose.model<IPayment>('Payment', paymentSchema);
