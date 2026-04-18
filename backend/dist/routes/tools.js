"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.dst', '.emb'];
        const fileExt = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(fileExt)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only images and embroidery files are allowed.'));
        }
    },
});
// Convert embroidery file (DST to EMB)
router.post('/convert-file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { sourceFormat, targetFormat } = req.body;
        // For now, this is a placeholder implementation
        // In a real application, you would use embroidery file processing libraries
        // such as pyembroidery (Python) or similar Node.js libraries
        res.json({
            message: 'File conversion initiated',
            originalFile: req.file.filename,
            sourceFormat,
            targetFormat,
            status: 'processing',
            // In real implementation, you would return the converted file path
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Count stitches from image
router.post('/count-stitches', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        // Placeholder implementation
        // In a real application, you would:
        // 1. Convert image to embroidery file
        // 2. Calculate stitch count from the embroidery file
        const mockStitchCount = Math.floor(Math.random() * 10000) + 1000; // Random stitch count for demo
        res.json({
            message: 'Stitch count calculated',
            imageFile: req.file.filename,
            stitchCount: mockStitchCount,
            estimatedTime: Math.ceil(mockStitchCount / 1000), // minutes
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Price estimation
router.post('/estimate-price', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const { productType, size, color, includeProduct = false, stitchCount } = req.body;
        // Base pricing logic
        const basePrices = {
            'tshirt': 1500,
            'shirt': 2000,
            'short': 1200,
            'overall': 3500,
        };
        const productPrice = basePrices[productType] || 1500;
        // Embroidery pricing (per 1000 stitches)
        const embroideryPricePerThousand = 100;
        const calculatedStitchCount = stitchCount || Math.floor(Math.random() * 10000) + 1000;
        const embroideryPrice = Math.ceil(calculatedStitchCount / 1000) * embroideryPricePerThousand;
        const totalPrice = includeProduct === 'true'
            ? productPrice + embroideryPrice
            : embroideryPrice;
        res.json({
            message: 'Price estimated successfully',
            details: {
                productType,
                size,
                color,
                includeProduct: includeProduct === 'true',
                stitchCount: calculatedStitchCount,
                pricing: {
                    productPrice: includeProduct === 'true' ? productPrice : 0,
                    embroideryPrice,
                    totalPrice,
                },
                imageFile: req.file.filename,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=tools.js.map