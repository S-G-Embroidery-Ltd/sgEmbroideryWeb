import express from 'express';
import { sendMailSafe } from '../services/email';

const router = express.Router();

// Test email endpoint (development only)
router.post('/email', async (req, res) => {
  try {
    const { to = 'shemtom12345@gmail.com' } = req.body;
    
    const result = await sendMailSafe({
      to,
      subject: 'Test Email from SG Embroidery Backend',
      text: 'This is a test email to verify the email configuration is working correctly.',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p>If you receive this email, the SMTP configuration is working!</p>
        <p>Best regards,<br>SG Embroidery Team</p>
      `
    });

    if (result) {
      res.json({ message: 'Test email sent successfully', to });
    } else {
      res.status(500).json({ message: 'Failed to send test email - SMTP not configured' });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send test email';
    console.error('Test email error:', error);
    res.status(500).json({ message: msg });
  }
});

export default router;
