import express from 'express';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const response = await AuthService.register({ name, email, password });

    res.status(201).json({
      message: 'User created successfully',
      ...response,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const response = await AuthService.login(email, password);

    res.json({
      message: 'Login successful',
      ...response,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

// Google Sign-In
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google access token is required' });
    }

    const response = await AuthService.googleLogin(token);

    res.json({
      message: 'Google login successful',
      ...response,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

// Get current user (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await AuthService.getCurrentUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User profile retrieved',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Development: Create test user
router.post('/test-user', async (req, res) => {
  try {
    const response = await AuthService.createTestUser();
    res.json({
      message: 'Test user created',
      ...response,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
