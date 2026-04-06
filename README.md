# SG Embroidery Website

A modern e-commerce website for SG Embroidery, featuring textile sales, embroidery tools, and comprehensive user experience.

## Features

### 🛍️ E-commerce
- Product catalog with filtering and search
- Shopping cart and checkout system
- Paystack payment integration
- Order tracking
- User favorites and wishlist

### 🧵 Embroidery Tools
- File converter (DST to EMB)
- Stitch counter from images
- Price estimator with real-time calculations
- Downloadable resources and guides

### 📱 User Experience
- Responsive design for all devices
- WhatsApp integration for customer support
- Newsletter subscription
- User authentication and profiles
- Blog system with tips and guides

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for API state management
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Paystack API** for payments
- **Multer** for file uploads

### Deployment
- **Frontend**: Netlify (free tier)
- **Backend**: Render.com ($7/month after free tier)
- **Database**: MongoDB Atlas (free tier)

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sg-embroidery-web
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   
   **Backend** (copy `.env.example` to `.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sg-embroidery
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   PAYSTACK_SECRET_KEY=your-paystack-secret-key
   ```
   
   **Frontend** (copy `.env.example` to `.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
   ```

5. **Start the development servers**
   
   **Backend** (from backend directory):
   ```bash
   npm run dev
   ```
   
   **Frontend** (from frontend directory):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

## Project Structure

```
sg-embroidery-web/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Tools
- `POST /api/tools/convert-file` - Convert embroidery files
- `POST /api/tools/count-stitches` - Count stitches from image
- `POST /api/tools/estimate-price` - Estimate embroidery price

### Payments
- `POST /api/payments/initiate` - Initiate Paystack payment
- `POST /api/payments/verify` - Verify payment

## Deployment

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variables in Netlify dashboard

### Backend (Render.com)
1. Connect your GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Configure MongoDB Atlas connection

## Cost Breakdown (Monthly)

- **Render.com Backend**: $7 (after free tier)
- **MongoDB Atlas**: $0 (free tier)
- **Netlify Frontend**: $0 (free tier)
- **Paystack**: Transaction fees only
- **Total Monthly Cost**: ~$7

## Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript
npm start        # Start production server
npm run lint     # Run ESLint
npm test         # Run tests
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: info@sgembroidery.com
- Phone: +254 700 000 000
- WhatsApp: +254 700 000 000
