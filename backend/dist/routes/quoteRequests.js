"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const optionalAuth_1 = require("../middleware/optionalAuth");
const auth_1 = require("../middleware/auth");
const QuoteRequest_1 = __importDefault(require("../models/QuoteRequest"));
const email_1 = require("../services/email");
const router = express_1.default.Router();
const refDir = path_1.default.join(process.cwd(), 'uploads', 'quote-references');
if (!fs_1.default.existsSync(refDir)) {
    fs_1.default.mkdirSync(refDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, refDir),
    filename: (req, file, cb) => {
        const user = req.user;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const name = (req.body.name || 'user').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
        const originalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const extension = originalName.split('.').pop();
        const baseName = originalName.split('.').slice(0, -1).join('.').slice(0, 30);
        cb(null, `${timestamp}-${name}-${baseName}.${extension}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 12 * 1024 * 1024 },
});
router.post('/', optionalAuth_1.optionalAuthMiddleware, upload.array('files', 5), async (req, res) => {
    try {
        const name = (req.body.name || '').toString().trim();
        const email = (req.body.email || '').toString().trim();
        const phone = (req.body.phone || '').toString().trim();
        const company = (req.body.company || '').toString().trim();
        const description = (req.body.description || '').toString().trim();
        const quantity = (req.body.quantity || '').toString().trim();
        const workSubmissionDate = (req.body.workSubmissionDate || '').toString().trim();
        const brandingTypes = Array.isArray(req.body.brandingTypes) ? req.body.brandingTypes : [];
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
        let uploadedFiles = [];
        if (req.files && Array.isArray(req.files)) {
            uploadedFiles = req.files.map(file => path_1.default.join('quote-references', file.filename).replace(/\\/g, '/'));
        }
        const doc = new QuoteRequest_1.default({
            userId: req.user?.userId || undefined,
            name,
            email,
            phone,
            company: company || undefined,
            description,
            quantity: quantity || undefined,
            workSubmissionDate: workSubmissionDate || undefined,
            brandingTypes: brandingTypes.length > 0 ? brandingTypes : undefined,
            specialInstructions: specialInstructions || undefined,
            referenceFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
            status: 'submitted',
        });
        await doc.save();
        void (0, email_1.emailNewQuoteRequest)({
            name,
            email,
            phone,
            company: company || undefined,
            description,
            quantity: quantity || undefined,
            workSubmissionDate: workSubmissionDate || undefined,
            brandingTypes: brandingTypes.length > 0 ? brandingTypes : undefined,
            specialInstructions: specialInstructions || undefined,
            referenceFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        }).catch((e) => console.error('[email] quote:', e));
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