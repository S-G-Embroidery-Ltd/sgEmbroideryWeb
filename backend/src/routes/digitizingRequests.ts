import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';
import Order from '../models/Order';
import { LOGO_ORIGINATION_KES } from '../config/pricing';
import { emailNewDigitizingOrder } from '../services/email';

const router = express.Router();

const TAX_RATE = 0.16;

/** LOGO_ORIGINATION_KES is the gross amount charged (inclusive of VAT). */
function computeDigitizingTotals() {
  const total = LOGO_ORIGINATION_KES;
  const subtotal = Math.round((total / (1 + TAX_RATE)) * 100) / 100;
  const tax = Math.round((total - subtotal) * 100) / 100;
  const shippingCost = 0;
  return { subtotal, tax, shippingCost, total };
}

const uploadDir = path.join(process.cwd(), 'uploads', 'digitizing');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const user = (req as express.Request & { user?: { userId: string } }).user;
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${user?.userId || 'anon'}-${safe}`);
  },
});

const upload = multer({
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
router.post('/', authMiddleware, upload.single('logo'), async (req, res) => {
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

    const relativePath = path.join('digitizing', req.file.filename).replace(/\\/g, '/');

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

    const order = new Order({
      userId: req.user.userId,
      orderType: 'digitizing',
      items: [
        {
          name: 'Logo digitizing (origination)',
          quantity: 1,
          price: LOGO_ORIGINATION_KES,
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
      void emailNewDigitizingOrder({
        name,
        email,
        phone,
        company: company || undefined,
        orderNumber: order.orderNumber,
        originalFileName: req.file.originalname,
        notes: notes || undefined,
      }).catch((e) => console.error('[email] digitizing:', e));
    } catch (saveErr) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch {
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create digitizing order';
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {
        /* ignore */
      }
    }
    res.status(500).json({ message: msg });
  }
});

export default router;
