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
const QuoteRequest_1 = __importDefault(require("../models/QuoteRequest"));
const router = express_1.default.Router();
const refDir = path_1.default.join(process.cwd(), 'uploads', 'quote-references');
if (!fs_1.default.existsSync(refDir)) {
    fs_1.default.mkdirSync(refDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, refDir),
    filename: (req, file, cb) => {
        const user = req.user;
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${user?.userId || 'anon'}-${safe}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 12 * 1024 * 1024 },
});
router.post('/', auth_1.authMiddleware, upload.single('reference'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const name = (req.body.name || '').toString().trim();
        const email = (req.body.email || '').toString().trim();
        const phone = (req.body.phone || '').toString().trim();
        const company = (req.body.company || '').toString().trim();
        const description = (req.body.description || '').toString().trim();
        const quantity = (req.body.quantity || '').toString().trim();
        const timeline = (req.body.timeline || '').toString().trim();
        const specialInstructions = (req.body.specialInstructions || '').toString().trim();
        if (!name || !email || !phone || !description) {
            if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
                try {
                    fs_1.default.unlinkSync(req.file.path);
                }
                catch {
                    /* ignore */
                }
            }
            return res.status(400).json({ message: 'Name, email, phone, and project description are required' });
        }
        let referenceFile;
        if (req.file) {
            referenceFile = path_1.default.join('quote-references', req.file.filename).replace(/\\/g, '/');
        }
        const doc = new QuoteRequest_1.default({
            userId: req.user.userId,
            name,
            email,
            phone,
            company: company || undefined,
            description,
            quantity: quantity || undefined,
            timeline: timeline || undefined,
            specialInstructions: specialInstructions || undefined,
            referenceFile,
            status: 'submitted',
        });
        await doc.save();
        res.status(201).json({
            message: 'Quote request submitted',
            quoteRequest: doc,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to save quote request';
        res.status(500).json({ message: msg });
    }
});
router.get('/my', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const list = await QuoteRequest_1.default.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
        res.json({ quoteRequests: list });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to load quotes';
        res.status(500).json({ message: msg });
    }
});
exports.default = router;
//# sourceMappingURL=quoteRequests.js.map