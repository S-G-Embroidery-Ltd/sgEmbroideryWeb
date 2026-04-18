"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const digitizingSchema = new mongoose_1.Schema({
    logoRelativePath: { type: String, required: true, trim: true },
    originalFileName: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    company: { type: String, trim: true },
    wantStitchingQuote: { type: String, trim: true },
    quantity: { type: String, trim: true },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
            trim: true,
        },
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ mpesaTransactionCode: 1 }, { sparse: true });
// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const OrderModel = this.constructor;
        const count = await OrderModel.countDocuments();
        this.orderNumber = `SG-${Date.now()}-${count.toString().padStart(4, '0')}`;
    }
    next();
});
exports.default = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map