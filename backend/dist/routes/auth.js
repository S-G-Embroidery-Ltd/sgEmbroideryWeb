"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const passwordValidator_1 = require("../utils/passwordValidator");
const email_1 = require("../services/email");
const router = express_1.default.Router();
// Rate limiting for authentication endpoints
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply rate limiting to auth routes
router.use(authLimiter);
async function fetchGoogleUserInfo(accessToken) {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok)
        return null;
    return (await res.json());
}
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required'
            });
        }
        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }
        // Password strength validation
        const passwordValidation = passwordValidator_1.PasswordValidator.validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                message: 'Password does not meet security requirements',
                feedback: passwordValidation.feedback,
                requirements: passwordValidator_1.PasswordValidator.generatePasswordRequirements()
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user (password will be hashed automatically by User model pre-save hook)
        const user = new User_1.default({ name, email, password });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: String(user._id) }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }
        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }
        // Find user and include password
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password using secure bcrypt comparison
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: String(user._id) }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});
// Google Sign-In (access token from GSI token client)
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
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
        let user = await User_1.default.findOne({ googleId: info.sub });
        if (!user) {
            const byEmail = await User_1.default.findOne({ email: info.email.toLowerCase() });
            if (byEmail) {
                if (byEmail.googleId && byEmail.googleId !== info.sub) {
                    return res.status(409).json({ message: 'Account exists with a different Google login' });
                }
                byEmail.googleId = info.sub;
                byEmail.name = info.name || byEmail.name;
                if (info.picture)
                    byEmail.avatar = info.picture;
                await byEmail.save();
                user = byEmail;
            }
            else {
                user = new User_1.default({
                    name: info.name || info.email.split('@')[0],
                    email: info.email.toLowerCase(),
                    googleId: info.sub,
                    avatar: info.picture,
                });
                await user.save();
            }
        }
        else {
            user.name = info.name || user.name;
            if (info.picture)
                user.avatar = info.picture;
            await user.save();
        }
        const jwtToken = jsonwebtoken_1.default.sign({ userId: String(user._id) }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get current user (protected route)
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User_1.default.findById(req.user.userId).populate('favorites');
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        // Send reset email
        const resetHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🔐 Password Reset</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Reset Your Password</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="margin: 0; color: #1e293b; font-size: 18px; line-height: 1.6;">
                Hi <strong>${user.name}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your S&G Embroidery account. Click the button below to reset your password.
              </p>
            </div>
            
            <!-- Reset Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🔒 Security Notice</h3>
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <!-- Alternative Link -->
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 5px 0 0 0; color: #1e40af; font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Security Team</p>
            <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">This is an automated security email</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await (0, email_1.sendMailSafe)({
            to: user.email,
            subject: 'Reset Your Password - S&G Embroidery',
            text: `Hi ${user.name},\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes. If you didn't request this, please ignore this email.\n\nS&G Embroidery Team`,
            html: resetHtml
        });
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }
});
// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }
        // Password strength validation
        const passwordValidation = passwordValidator_1.PasswordValidator.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                message: 'Password does not meet security requirements',
                feedback: passwordValidation.feedback,
                requirements: passwordValidator_1.PasswordValidator.generatePasswordRequirements()
            });
        }
        // Find user with valid reset token
        const user = await User_1.default.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        // Update password and clear reset token
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        // Send confirmation email
        const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">✅ Password Reset</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Successfully Changed</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="margin: 0; color: #1e293b; font-size: 18px; line-height: 1.6;">
                Hi <strong>${user.name}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Your password has been successfully reset for your S&G Embroidery account.
              </p>
            </div>
            
            <!-- Success Message -->
            <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">🎉 Success!</h3>
              <p style="margin: 0; color: #166534; font-size: 16px;">
                You can now log in with your new password
              </p>
            </div>
            
            <!-- Login Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Log In Now
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🔒 Security Reminder</h3>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you didn't request this password change, please contact our support team immediately.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Security Team</p>
            <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">Your account security is our priority</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await (0, email_1.sendMailSafe)({
            to: user.email,
            subject: 'Password Successfully Reset - S&G Embroidery',
            text: `Hi ${user.name},\n\nYour password has been successfully reset for your S&G Embroidery account.\n\nYou can now log in with your new password.\n\nIf you didn't request this change, please contact our support team immediately.\n\nS&G Embroidery Team`,
            html: confirmationHtml
        });
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map