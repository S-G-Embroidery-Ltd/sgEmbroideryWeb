import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authDevRoutes from './routes/authDev';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/user';
import toolsRoutes from './routes/tools';
import paymentRoutes from './routes/payments';
import paystackWebhookRouter from './routes/paystackWebhook';
import internalRoutes from './routes/internal';
import digitizingRequestRoutes from './routes/digitizingRequests';
import quoteRequestRoutes from './routes/quoteRequests';
import { getCheckoutInfo } from './routes/checkoutInfo';
import { getCorsOrigins } from './utils/corsOrigins';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: getCorsOrigins(),
  credentials: true,
}));

// Paystack webhook: raw body required for HMAC (must be before express.json)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), paystackWebhookRouter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadsRoot = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}
app.use('/uploads', express.static(uploadsRoot));

// Routes
app.get('/api/checkout-info', getCheckoutInfo);
app.use('/api/auth', authDevRoutes); // Using development auth routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/internal', internalRoutes);
app.use('/api/digitizing-requests', digitizingRequestRoutes);
app.use('/api/quote-requests', quoteRequestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server without MongoDB connection
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🗄️  Using in-memory database for development`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Auth endpoints available at /api/auth`);
  console.log(`📝 Available endpoints:`);
  console.log(`   POST /api/auth/register - Register new user`);
  console.log(`   POST /api/auth/login - Login with email/password`);
  console.log(`   POST /api/auth/google - Google OAuth login`);
  console.log(`   GET  /api/auth/me - Get current user (protected)`);
  console.log(`   POST /api/auth/test-user - Create test user (dev only)`);
});

export default app;
