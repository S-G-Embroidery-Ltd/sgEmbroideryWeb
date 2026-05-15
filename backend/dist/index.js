"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const user_1 = __importDefault(require("./routes/user"));
const tools_1 = __importDefault(require("./routes/tools"));
const payments_1 = __importDefault(require("./routes/payments"));
const paystackWebhook_1 = __importDefault(require("./routes/paystackWebhook"));
const internal_1 = __importDefault(require("./routes/internal"));
const digitizingRequests_1 = __importDefault(require("./routes/digitizingRequests"));
const quoteRequests_1 = __importDefault(require("./routes/quoteRequests"));
const checkoutInfo_1 = require("./routes/checkoutInfo");
const corsOrigins_1 = require("./utils/corsOrigins");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
// Middleware
app.use((0, helmet_1.default)());
app.use(limiter);
app.use((0, cors_1.default)({
    origin: (0, corsOrigins_1.getCorsOrigins)(),
    credentials: true,
}));
// Paystack webhook: raw body required for HMAC (must be before express.json)
app.use('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }), paystackWebhook_1.default);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const uploadsRoot = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsRoot)) {
    fs_1.default.mkdirSync(uploadsRoot, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsRoot));
// Routes
app.get('/api/checkout-info', checkoutInfo_1.getCheckoutInfo);
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/user', user_1.default);
app.use('/api/tools', tools_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/internal', internal_1.default);
app.use('/api/digitizing-requests', digitizingRequests_1.default);
app.use('/api/quote-requests', quoteRequests_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const LOCAL_MONGO = 'mongodb://localhost:27017/sg-embroidery';
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
async function connectMongoWithRetries() {
    const uri = process.env.MONGODB_URI?.trim();
    if (process.env.RENDER && !uri) {
        console.error('[startup] MONGODB_URI is not set. Add it under Render → Environment → MONGODB_URI (your Atlas connection string).');
        process.exit(1);
    }
    const connectionString = uri || LOCAL_MONGO;
    const opts = {
        serverSelectionTimeoutMS: 12000,
    };
    const maxAttempts = Number(process.env.MONGO_CONNECT_RETRIES) || 5;
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await mongoose_1.default.connect(connectionString, opts);
            console.log(`✅ Connected to MongoDB (attempt ${attempt}/${maxAttempts})`);
            return;
        }
        catch (err) {
            lastErr = err;
            console.error(`[startup] MongoDB connection attempt ${attempt}/${maxAttempts} failed:`, err);
            if (attempt < maxAttempts) {
                const delay = Math.min(2000 * attempt, 10000);
                console.error(`[startup] Retrying in ${delay}ms… (Atlas: allow 0.0.0.0/0 under Network Access, or confirm MONGODB_URI user/password and URL-encoded password)`);
                await sleep(delay);
            }
        }
    }
    console.error('[startup] Could not connect to MongoDB after retries. Check Atlas Network Access (IP allowlist), Database user/password, and MONGODB_URI on Render.');
    console.error(lastErr);
    process.exit(1);
}
void connectMongoWithRetries().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`�️  Using MongoDB for data storage`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map