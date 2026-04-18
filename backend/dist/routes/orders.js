"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_1 = require("../middleware/auth");
const email_1 = require("../services/email");
const router = express_1.default.Router();
const TAX_RATE = 0.16;
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 300;
function computeOrderAmounts(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;
    return { subtotal, tax, shippingCost, total };
}
function isMongoId(value) {
    return typeof value === 'string' && mongoose_1.default.Types.ObjectId.isValid(value) && value.length === 24;
}
// Create new order (protected)
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { items, shippingAddress, paymentChannel: rawChannel } = req.body;
        const paymentChannel = rawChannel === 'mpesa_manual' ? 'mpesa_manual' : 'paystack';
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }
        if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.phone
            || !shippingAddress?.address || !shippingAddress?.city
            || !shippingAddress?.country || !shippingAddress?.postalCode) {
            return res.status(400).json({ message: 'Complete shipping address is required' });
        }
        const lineItems = [];
        for (const item of items) {
            const qty = Math.max(1, Math.floor(Number(item.quantity)) || 1);
            const price = Number(item.price);
            if (Number.isNaN(price) || price < 0) {
                return res.status(400).json({ message: 'Invalid item price' });
            }
            const name = (item.name || 'Product').toString().trim();
            const line = {
                name,
                quantity: qty,
                price,
                size: item.size,
                color: item.color,
                image: item.image,
            };
            const productRef = item.product ?? item.id;
            if (isMongoId(productRef)) {
                line.product = new mongoose_1.default.Types.ObjectId(productRef);
            }
            lineItems.push(line);
        }
        const { subtotal, tax, shippingCost, total } = computeOrderAmounts(lineItems.map((i) => ({ price: i.price, quantity: i.quantity })));
        const order = new Order_1.default({
            userId: req.user.userId,
            items: lineItems,
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress,
            paymentChannel,
        });
        await order.save();
        await order.populate('items.product');
        if (!order.orderType || order.orderType === 'standard') {
            void (0, email_1.emailNewShopOrder)(order).catch((e) => console.error('[email] new shop order:', e));
        }
        res.status(201).json({
            message: 'Order created successfully',
            order,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get user orders (protected)
router.get('/my-orders', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { page = 1, limit = 10 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const orders = await Order_1.default.find({ userId: req.user.userId })
            .populate('items.product')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        const total = await Order_1.default.countDocuments({ userId: req.user.userId });
        res.json({
            orders,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Submit M-Pesa confirmation code (Till / Buy Goods) — staff confirms via separate admin + internal API
router.post('/:id/mpesa-code', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const code = (req.body?.code ?? '').toString().trim().replace(/\s+/g, '');
        if (!code || code.length < 4) {
            return res.status(400).json({ message: 'Valid M-Pesa code is required' });
        }
        const order = await Order_1.default.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if ((order.paymentChannel || 'paystack') !== 'mpesa_manual') {
            return res.status(400).json({ message: 'This order does not use M-Pesa manual payment' });
        }
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Order is already paid' });
        }
        order.mpesaTransactionCode = code;
        order.mpesaSubmittedAt = new Date();
        order.paymentStatus = 'awaiting_manual_confirmation';
        await order.save();
        void (0, email_1.emailMpesaCodeSubmitted)(order, code).catch((e) => console.error('[email] mpesa code:', e));
        res.json({
            message: 'M-Pesa code received. We will verify your payment shortly.',
            order,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Receipt summary (JSON) for paid orders
router.get('/:id/receipt', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const order = await Order_1.default.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        }).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.paymentStatus !== 'paid') {
            return res.status(400).json({ message: 'Order is not paid yet' });
        }
        res.json({
            orderNumber: order.orderNumber,
            paidAt: order.paidAt,
            total: order.total,
            paymentChannel: order.paymentChannel,
            paystackReference: order.paystackReference || order.paymentId,
            mpesaTransactionCode: order.mpesaTransactionCode,
            items: order.items,
            shippingAddress: order.shippingAddress,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get single order (protected)
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const order = await Order_1.default.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        }).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update order status (admin route - for now, user can cancel their own orders)
router.patch('/:id/status', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { status } = req.body;
        const validStatuses = ['pending', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const order = await Order_1.default.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Only allow cancellation if order is pending
        if (status === 'cancelled' && order.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel order that is not pending' });
        }
        order.status = status;
        await order.save();
        res.json({
            message: 'Order status updated successfully',
            order,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map