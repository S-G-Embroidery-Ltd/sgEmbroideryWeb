"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const Order_1 = __importDefault(require("../models/Order"));
const pricing_1 = require("../config/pricing");
const router = express_1.default.Router();
const TAX_RATE = 0.16;
/** LOGO_ORIGINATION_KES is the gross amount charged (inclusive of VAT). */
function computeDigitizingTotals() {
    const total = pricing_1.LOGO_ORIGINATION_KES;
    const subtotal = Math.round((total / (1 + TAX_RATE)) * 100) / 100;
    const tax = Math.round((total - subtotal) * 100) / 100;
    const shippingCost = 0;
    return { subtotal, tax, shippingCost, total };
}
const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'digitizing');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const user = req.user;
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${user?.userId || 'anon'}-${safe}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 12 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ok = file.mimetype === 'image/png' || file.mimetype === 'image/jpeg';
        if (!ok) {
            cb(new Error('Only PNG or JPEG images are allowed'));
            return;
        }
        cb(null, true);
    },
});
/**
 * Create a digitizing order with uploaded logo, then client calls POST /payments/initiate.
 * Payment must succeed before work proceeds; logo is stored with the pending order.
 */
router.post('/', auth_1.authMiddleware, upload.single('logo'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Logo file (PNG or JPEG) is required' });
        }
        const name = (req.body.name || '').toString().trim();
        const email = (req.body.email || '').toString().trim();
        const phone = (req.body.phone || '').toString().trim();
        const company = (req.body.company || '').toString().trim();
        const notes = (req.body.notes || '').toString().trim();
        const wantStitchingQuote = (req.body.wantStitchingQuote || '').toString().trim();
        const quantity = (req.body.quantity || '').toString().trim();
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone are required' });
        }
        const relativePath = path_1.default.join('digitizing', req.file.filename).replace(/\\/g, '/');
        const { subtotal, tax, shippingCost, total } = computeDigitizingTotals();
        const shippingAddress = {
            name,
            email,
            phone,
            address: 'Digitizing request — digital delivery (no physical shipment)',
            city: 'Nairobi',
            country: 'Kenya',
            postalCode: '00000',
        };
        const order = new Order_1.default({
            userId: req.user.userId,
            orderType: 'digitizing',
            items: [
                {
                    name: 'Logo digitizing (origination)',
                    quantity: 1,
                    price: pricing_1.LOGO_ORIGINATION_KES,
                    image: relativePath,
                },
            ],
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress,
            digitizing: {
                logoRelativePath: relativePath,
                originalFileName: req.file.originalname,
                notes: notes || undefined,
                company: company || undefined,
                wantStitchingQuote: wantStitchingQuote || undefined,
                quantity: quantity || undefined,
            },
        });
        try {
            await order.save();
        }
        catch (saveErr) {
            if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
                try {
                    fs_1.default.unlinkSync(req.file.path);
                }
                catch {
                    /* ignore */
                }
            }
            throw saveErr;
        }
        res.status(201).json({
            message: 'Digitizing order created. Complete payment to submit your request.',
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                subtotal: order.subtotal,
                tax: order.tax,
            },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to create digitizing order';
        if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch {
                /* ignore */
            }
        }
        res.status(500).json({ message: msg });
    }
});
exports.default = router;
//# sourceMappingURL=digitizingRequests.js.map