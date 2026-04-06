# 🚀 Quick Setup Checklist

## 📋 MongoDB Setup (5 minutes)

### ✅ MongoDB Atlas Setup
- [ ] Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free account
- [ ] Build M0 Sandbox cluster (free)
- [ ] Add IP address: 0.0.0.0/0 (allow all)
- [ ] Create database user: `sg-embroidery-user`
- [ ] Get connection string
- [ ] Save connection string to clipboard

## 🌐 Render Setup (10 minutes)

### ✅ Frontend Deployment
- [ ] Go to [Render](https://render.com)
- [ ] Sign up with GitHub
- [ ] Click "New" → "Web Service"
- [ ] Connect your GitHub repo
- [ ] Configure:
  - Name: `sg-embroidery-frontend`
  - Root Directory: `frontend`
  - Runtime: `Node`
  - Build: `cd frontend && npm install && npm run build`
  - Start: `cd frontend && npm run preview`
- [ ] Add environment variables:
  - `VITE_API_URL=https://your-backend-url.onrender.com/api`
  - `VITE_GOOGLE_CLIENT_ID=your-google-client-id`
- [ ] Deploy!

### ✅ Backend Deployment
- [ ] Create backend folder in your repo
- [ ] Add backend files (see examples)
- [ ] Push to GitHub
- [ ] Create new Web Service on Render
- [ ] Configure:
  - Name: `sg-embroidery-backend`
  - Root Directory: `backend`
  - Runtime: `Node`
  - Build: `cd backend && npm install`
  - Start: `cd backend && npm start`
- [ ] Add environment variables:
  - `MONGODB_URI=your-mongodb-connection-string`
  - `JWT_SECRET=your-secret-key`
  - `GOOGLE_CLIENT_ID=your-google-client-id`
  - `GOOGLE_CLIENT_SECRET=your-google-client-secret`
  - `NODE_ENV=production`
- [ ] Deploy!

## 🔧 Google OAuth Setup (5 minutes)

### ✅ Google Cloud Console
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project or select existing
- [ ] Enable Google+ API and Google OAuth2 API
- [ ] Create OAuth 2.0 Client ID:
  - Application type: Web application
  - Name: SG Embroidery
  - Authorized origins: 
    - `http://localhost:5173` (dev)
    - `https://your-frontend.onrender.com` (prod)
  - Authorized redirect URIs:
    - `http://localhost:5173` (dev)
    - `https://your-frontend.onrender.com` (prod)
- [ ] Copy Client ID and Client Secret
- [ ] Add to Render environment variables

## 📁 Required Backend Files

### Create these files in `/backend` folder:
```
backend/
├── package.json          # Use package.example.json
├── server.js             # Use server.example.js
├── .env                  # Use .env.example
├── models/
│   └── User.js           # User model
├── routes/
│   ├── auth.js           # Auth routes
│   ├── products.js       # Product routes
│   └── orders.js         # Order routes
└── middleware/
    └── auth.js           # Auth middleware
```

## 🚀 Quick Deploy Commands

```bash
# 1. Setup GitHub repo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sg-embroidery.git
git push -u origin main

# 2. Deploy to Render (automatic after push)
# Frontend will be at: https://sg-embroidery-frontend.onrender.com
# Backend will be at: https://sg-embroidery-backend.onrender.com

# 3. Update frontend API URL
# Get backend URL from Render and update VITE_API_URL
# Redeploy frontend
```

## ✅ Verification Checklist

### After Deployment
- [ ] Frontend loads at your Render URL
- [ ] Backend health check works: `https://your-backend.onrender.com/api/health`
- [ ] Database connection established
- [ ] Registration page works
- [ ] Login page works
- [ ] Google OAuth works
- [ ] User can access protected routes

### Test URLs
- Frontend: `https://sg-embroidery-frontend.onrender.com`
- Backend API: `https://sg-embroidery-backend.onrender.com/api/health`
- Login: `https://sg-embroidery-frontend.onrender.com/login`
- Register: `https://sg-embroidery-frontend.onrender.com/register`

## 🔧 Troubleshooting

### Common Issues
1. **Frontend can't reach backend**
   - Check CORS settings
   - Verify VITE_API_URL is correct
   - Check backend is running

2. **Database connection failed**
   - Verify MongoDB URI format
   - Check IP access in MongoDB Atlas
   - Ensure user credentials are correct

3. **Google OAuth not working**
   - Verify Client ID is correct
   - Check authorized origins
   - Ensure redirect URIs match

## 💰 Cost Summary

### Free Tier Usage
- **Render**: 750 hours/month (enough for 24/7)
- **MongoDB Atlas**: 512MB storage
- **Total Cost**: $0/month (to start)

### When to Upgrade
- >100 concurrent users
- Need custom domain ($1/month)
- More database storage
- Better performance

## 🎯 Success Metrics

Your setup is successful when:
- ✅ Both services deploy without errors
- ✅ Frontend loads and shows login/register
- ✅ Users can register with email
- ✅ Users can login with Google
- ✅ Auth tokens work properly
- ✅ Protected routes function

**Total Setup Time: ~20 minutes**
