# 🚀 Render + MongoDB Setup Guide

## Overview
This guide covers setting up Render for hosting your SG Embroidery frontend and backend, plus MongoDB for data storage.

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Choose the free M0 cluster (512MB storage)

#### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **M0 Sandbox** (free tier)
3. Select cloud provider and region (choose closest to your users)
4. Cluster name: `sg-embroidery-cluster`
5. Click "Create Cluster"

#### Step 3: Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Select **"Allow access from anywhere"** (0.0.0.0/0) for development
3. For production, add your Render service IP

#### Step 4: Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Username: `sg-embroidery-user`
3. Password: Generate a strong password
4. Permissions: "Read and write to any database"
5. Click "Add User"

#### Step 5: Get Connection String
1. Go to "Database" → "Connect" → "Connect your application"
2. Select **Node.js** driver
3. Copy the connection string
4. Replace `<password>` with your actual password

### Option 2: Self-Hosted MongoDB (Advanced)

#### Using Docker
```bash
# Create docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    container_name: sg-embroidery-mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your-secure-password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down
```

## 🌐 Render Setup

### Step 1: Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 2: Frontend Deployment

#### Create Web Service
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `sg-embroidery-frontend`
   - **Root Directory**: `frontend` (if monorepo)
   - **Runtime**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview`
   - **Instance Type**: `Free` (to start)

#### Environment Variables
```env
# Frontend Environment Variables
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-key
```

### Step 3: Backend Deployment

#### Create Backend Web Service
1. Click **"New"** → **"Web Service"**
2. Configure service:
   - **Name**: `sg-embroidery-backend`
   - **Root Directory**: `backend` (if monorepo)
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

#### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sg-embroidery?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Render
PORT=3000
NODE_ENV=production
```

## 🔧 Backend Implementation

### Required Backend Structure
```
backend/
├── package.json
├── server.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
└── config/
    └── database.js
```

### Package.json Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "google-auth-library": "^9.0.0",
    "nodemailer": "^6.9.4"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Database Connection
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### User Model
```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'email';
    }
  },
  avatar: String,
  provider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  googleId: String
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Code
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/sg-embroidery.git
git push -u origin main
```

### Step 2: Deploy Frontend
1. Go to Render dashboard
2. Create new Web Service
3. Connect GitHub repo
4. Configure as shown above
5. Deploy!

### Step 3: Deploy Backend
1. Create another Web Service
2. Configure backend settings
3. Add environment variables
4. Deploy!

### Step 4: Update Frontend URLs
After backend deployment:
1. Get backend URL from Render
2. Update frontend environment variable: `VITE_API_URL`
3. Redeploy frontend

## 🔒 Security Considerations

### Environment Variables Security
- Never commit `.env` files to git
- Use Render's environment variable manager
- Generate strong JWT secrets
- Use app passwords for email (not regular passwords)

### Database Security
- Use MongoDB Atlas for production
- Enable network access restrictions
- Use strong database passwords
- Enable backup in MongoDB Atlas

### API Security
- Validate all inputs
- Use rate limiting
- Implement CORS properly
- Use HTTPS (automatic on Render)

## 📊 Monitoring & Logs

### Render Monitoring
- Automatic health checks
- Real-time logs
- Metrics dashboard
- Error tracking

### MongoDB Atlas Monitoring
- Performance metrics
- Query analyzer
- Real-time monitoring
- Backup management

## 🔄 CI/CD Pipeline

### Automatic Deployments
Render automatically deploys when you push to GitHub:
```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main

# Render automatically builds and deploys
```

### Environment-specific Configs
```javascript
// Use environment variables
const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = isProduction 
  ? process.env.MONGODB_URI 
  : 'mongodb://localhost:27017/sg-embroidery-dev';
```

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check MongoDB URI format
   - Verify network access settings
   - Ensure user permissions

2. **Frontend Can't Reach Backend**
   - Check CORS settings
   - Verify API URL in environment
   - Check backend is running

3. **Build Failures**
   - Check package.json scripts
   - Verify all dependencies installed
   - Check build logs on Render

### Debug Commands
```bash
# Check backend logs
curl https://your-backend.onrender.com/api/health

# Test database connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/sg-embroidery"

# Check frontend build
npm run build
```

## 💰 Cost Optimization

### Free Tier Limits
- **Render**: 750 hours/month free
- **MongoDB Atlas**: 512MB free storage
- **Custom Domains**: $1/month on Render

### When to Upgrade
- High traffic (>100 requests/minute)
- More storage needed
- Custom domain required
- Better performance needed

## 📝 Next Steps

1. **Set up MongoDB Atlas** account
2. **Create backend API** with authentication
3. **Deploy to Render** (frontend + backend)
4. **Configure environment** variables
5. **Test the full application**
6. **Set up custom domain** (optional)

Your SG Embroidery website will be fully hosted and functional with this setup!
