import express from 'express';
import { emailNewContactMessage } from '../services/email';
import Contact from '../models/Contact';
import { optionalAuthMiddleware } from '../middleware/optionalAuth';

const router = express.Router();

// Contact form submission (public, but captures user ID if authenticated)
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Store in MongoDB first
    const contact = new Contact({
      userId: req.user?.userId || undefined,
      name: name.toString().trim(),
      email: email.toString().trim(),
      phone: phone?.toString().trim() || '',
      subject: subject?.toString().trim() || 'General Inquiry',
      message: message.toString().trim(),
    });

    await contact.save();

    // Send email notifications
    await emailNewContactMessage({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
    });

    res.status(200).json({ 
      message: 'Message sent successfully',
      contactId: contact._id 
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send message';
    console.error('Contact form error:', error);
    res.status(500).json({ message: msg });
  }
});

export default router;
