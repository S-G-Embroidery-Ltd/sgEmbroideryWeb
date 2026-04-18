import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

type GoogleUserInfo = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as GoogleUserInfo;
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Google Sign-In (access token from GSI token client)
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body as { token?: string };
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Google access token is required' });
    }

    const info = await fetchGoogleUserInfo(token);
    if (!info?.sub || !info.email) {
      return res.status(401).json({ message: 'Invalid or expired Google token' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    if (clientId && info.email_verified === false) {
      return res.status(401).json({ message: 'Google email not verified' });
    }

    let user = await User.findOne({ googleId: info.sub });
    if (!user) {
      const byEmail = await User.findOne({ email: info.email.toLowerCase() });
      if (byEmail) {
        if (byEmail.googleId && byEmail.googleId !== info.sub) {
          return res.status(409).json({ message: 'Account exists with a different Google login' });
        }
        byEmail.googleId = info.sub;
        byEmail.name = info.name || byEmail.name;
        if (info.picture) byEmail.avatar = info.picture;
        await byEmail.save();
        user = byEmail;
      } else {
        user = new User({
          name: info.name || info.email.split('@')[0],
          email: info.email.toLowerCase(),
          googleId: info.sub,
          avatar: info.picture,
        });
        await user.save();
      }
    } else {
      user.name = info.name || user.name;
      if (info.picture) user.avatar = info.picture;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user.userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favorites: user.favorites,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
