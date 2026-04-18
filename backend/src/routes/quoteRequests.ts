import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';
import QuoteRequest from '../models/QuoteRequest';

const router = express.Router();

const refDir = path.join(process.cwd(), 'uploads', 'quote-references');
if (!fs.existsSync(refDir)) {
  fs.mkdirSync(refDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, refDir),
  filename: (req, file, cb) => {
    const user = (req as express.Request & { user?: { userId: string } }).user;
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${user?.userId || 'anon'}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
});

router.post('/', authMiddleware, upload.single('reference'), async (req, res) => {
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
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch {
          /* ignore */
        }
      }
      return res.status(400).json({ message: 'Name, email, phone, and project description are required' });
    }

    let referenceFile: string | undefined;
    if (req.file) {
      referenceFile = path.join('quote-references', req.file.filename).replace(/\\/g, '/');
    }

    const doc = new QuoteRequest({
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to save quote request';
    res.status(500).json({ message: msg });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const list = await QuoteRequest.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ quoteRequests: list });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to load quotes';
    res.status(500).json({ message: msg });
  }
});

export default router;
