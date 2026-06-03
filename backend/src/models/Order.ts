import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product?: mongoose.Types.ObjectId;
  /** Line title when cart items are not linked to a Product document */
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
  customization?: {
    embroideryFile?: string;
    stitchCount?: number;
    placement?: string;
  };
}

export interface IOrderDigitizing {
  logoRelativePath: string;
  originalFileName: string;
  notes?: string;
  company?: string;
  wantStitchingQuote?: string;
  quantity?: string;
}

export interface IOrderDeliveryInfo {
  zone: string;
  zoneName: string;
  county: string;
  baseCost: number;
  finalCost: number;
  estimatedDays: number;
  freeShippingApplied: boolean;
  estimatedDelivery: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderType?: 'standard' | 'digitizing';
  digitizing?: IOrderDigitizing;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  paymentChannel: 'paystack' | 'mpesa_manual';
  paymentStatus:
    | 'pending'
    | 'awaiting_manual_confirmation'
    | 'paid'
    | 'failed'
    | 'refunded';
  mpesaTransactionCode?: string;
  mpesaSubmittedAt?: Date;
  paystackReference?: string;
  paidAt?: Date;
  paystackAmount?: number;
  receiptEmailedAt?: Date;
  deliveredAt?: Date;
  deliveryConfirmedAt?: Date;
  reviewSubmitted?: string[]; // Array of product IDs that have been reviewed
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    county: string;
    postalCode: string;
  };
  deliveryInfo?: IOrderDeliveryInfo;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  size: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  customization: {
    embroideryFile: String,
    stitchCount: Number,
    placement: String,
  },
});

const digitizingSchema = new Schema<IOrderDigitizing>(
  {
    logoRelativePath: { type: String, required: true, trim: true },
    originalFileName: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    company: { type: String, trim: true },
    wantStitchingQuote: { type: String, trim: true },
    quantity: { type: String, trim: true },
  },
  { _id: false }
);

const deliveryInfoSchema = new Schema<IOrderDeliveryInfo>(
  {
    zone: { type: String, required: true, trim: true },
    zoneName: { type: String, required: true, trim: true },
    county: { type: String, required: true, trim: true },
    baseCost: { type: Number, required: true, min: 0 },
    finalCost: { type: Number, required: true, min: 0 },
    estimatedDays: { type: Number, required: true, min: 1 },
    freeShippingApplied: { type: Boolean, required: true },
    estimatedDelivery: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderType: {
    type: String,
    enum: ['standard', 'digitizing'],
    default: 'standard',
  },
  digitizing: {
    type: digitizingSchema,
    required: false,
  },
  items: [orderItemSchema],
  deliveryInfo: {
    type: deliveryInfoSchema,
    required: false,
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative'],
  },
  shippingCost: {
    type: Number,
    required: true,
    min: [0, 'Shipping cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Status must be pending, processing, shipped, delivered, or cancelled',
    },
    default: 'pending',
  },
  paymentId: String,
  paymentChannel: {
    type: String,
    enum: ['paystack', 'mpesa_manual'],
    default: 'paystack',
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'awaiting_manual_confirmation', 'paid', 'failed', 'refunded'],
      message: 'Invalid payment status',
    },
    default: 'pending',
  },
  mpesaTransactionCode: { type: String, trim: true },
  mpesaSubmittedAt: { type: Date },
  paystackReference: { type: String, trim: true },
  paidAt: { type: Date },
  paystackAmount: { type: Number },
  receiptEmailedAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryConfirmedAt: { type: Date },
  reviewSubmitted: [{ type: String }], // Array of product IDs that have been reviewed
  shippingAddress: {
    name: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    county: {
      type: String,
      required: [true, 'County is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  orderNumber: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ mpesaTransactionCode: 1 }, { sparse: true });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const OrderModel = this.constructor as typeof mongoose.Model;
    const count = await OrderModel.countDocuments();
    this.orderNumber = `SG-${Date.now()}-${count.toString().padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
