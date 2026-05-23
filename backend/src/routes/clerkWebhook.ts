import { Router } from 'express';
import crypto from 'crypto';
import User from '../models/User';

const router = Router();

/**
 * Clerk webhook - sync users when they are created/updated in Clerk
 */
router.post('/', async (req, res) => {
  try {
    const rawBody = req.body;
    if (!rawBody) {
      return res.status(400).send('Expected raw body');
    }

    const signature = req.headers['clerk-signature'] as string | undefined;
    const secret = process.env.CLERK_WEBHOOK_SECRET?.trim();

    if (secret && signature) {
      const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(rawBody)).digest('hex');
      if (signature !== expected) {
        console.warn('[clerk webhook] Invalid signature');
        return res.status(401).send('Invalid signature');
      }
    }

    const { type, data } = rawBody;

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, username, profile_image_url } = data;
      
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        console.warn('[clerk webhook] No email found in user data');
        return res.status(400).send('No email found');
      }

      const name = [first_name, last_name].filter(Boolean).join(' ') || username || '';
      
      // Update or create user in MongoDB
      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          clerkId: id,
          name,
          email: email.toLowerCase(),
          avatar: profile_image_url,
          provider: 'clerk',
        },
        { upsert: true, new: true }
      );

      console.log(`[clerk webhook] User synced: ${email}`);
    }

    res.status(200).send('OK');
  } catch (error: unknown) {
    console.error('[clerk webhook]', error);
    res.status(500).send('Error');
  }
});

export default router;
