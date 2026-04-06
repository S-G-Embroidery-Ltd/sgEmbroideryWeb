# Authentication Implementation Guide

## Overview
This guide covers the complete authentication implementation for SG Embroidery website, including:
- Email/password authentication
- Google OAuth 2.0 integration
- JWT token management
- Protected routes
- User session management

## 🚀 Quick Setup

### 1. Environment Configuration
Create a `.env` file in the frontend root:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your actual values
```

Required environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 2. Google OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API

#### Step 2: Create OAuth 2.0 Credentials
1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Select "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `https://yourdomain.com`
6. Copy the Client ID to your `.env` file

### 3. Backend Implementation

#### Required API Endpoints
```javascript
// POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

// POST /auth/google
{
  "token": "google-oauth-token"
}

// GET /auth/me (protected)
// Returns current user profile
```

#### Backend Response Format
```javascript
// Success Response (both login and register)
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "optional-avatar-url",
    "provider": "email" | "google"
  }
}
```

## 🔧 Frontend Implementation

### Authentication Hook (`useAuth.tsx`)
The auth hook provides:
- `login(email, password)` - Email/password login
- `register(name, email, password)` - User registration
- `loginWithGoogle()` - Google OAuth login
- `logout()` - Clear session
- `user` - Current user object
- `isLoading` - Loading state

### Usage Examples

#### Login Component
```tsx
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  
  const handleEmailLogin = async () => {
    try {
      await login(email, password);
      // Navigate to dashboard
    } catch (error) {
      // Handle error
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigate to dashboard
    } catch (error) {
      // Handle error
    }
  };
};
```

#### Protected Routes
```tsx
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};
```

#### User Profile Display
```tsx
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header>
      {user ? (
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </header>
  );
};
```

## 🎨 UI Components

### Login Page Features
- Email/password form with validation
- Google Sign-In button with official Google branding
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Error handling and loading states
- New color scheme (red, yellow, black, white)

### Register Page Features
- Full registration form with name, email, password
- Password confirmation with validation
- Google Sign-In option
- Form validation and error handling
- Loading states

## 🔒 Security Features

### Frontend Security
- JWT token stored in localStorage
- Automatic token injection in API requests
- Token expiration handling
- Automatic logout on 401 responses
- Protected route implementation

### Google OAuth Security
- OAuth 2.0 flow with proper token exchange
- Token validation on backend
- Secure token handling
- Proper scope management (email, profile)

## 🌐 API Integration

### Request Interceptor
```typescript
// Automatically adds auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor
```typescript
// Handles token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🚀 Deployment Considerations

### Environment Variables
```env
# Development
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=dev-client-id

# Production
VITE_API_URL=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=prod-client-id
```

### Google OAuth Production Setup
1. Add production domain to authorized origins
2. Update redirect URIs for production
3. Ensure HTTPS is enabled (required for OAuth)
4. Test thoroughly in production environment

## 🐛 Troubleshooting

### Common Issues
1. **Google Sign-In not working**
   - Check Client ID is correct
   - Verify domain is authorized
   - Ensure Google script loads properly

2. **Token not persisting**
   - Check localStorage is available
   - Verify token is being stored correctly
   - Check for browser security settings

3. **API requests failing**
   - Verify token is being sent
   - Check backend CORS settings
   - Ensure API URL is correct

### Debug Mode
Add to your `.env`:
```env
VITE_DEBUG_AUTH=true
```

Then check browser console for detailed auth logs.

## 📝 Next Steps

1. **Backend Implementation**: Set up the required API endpoints
2. **Google OAuth**: Complete Google Cloud Console setup
3. **Testing**: Thoroughly test all auth flows
4. **Production Deployment**: Configure production environment
5. **Security Audit**: Review security implementation

## 📞 Support

For authentication issues:
1. Check this guide first
2. Review browser console logs
3. Verify environment variables
4. Test backend API endpoints separately
