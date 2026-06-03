import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    // Check localStorage first (remember me), then sessionStorage
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Verify token and get user data
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (authToken: string) => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setToken(authToken);
    } catch (error: unknown) {
      // Only log out if we get a 401 Unauthorized response
      // Other errors (network, server) should not log out the user
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      // For other errors, keep the user logged in and use cached data if available
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('token', authToken);
        localStorage.setItem('rememberMe', 'false');
      }
      
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      const response = await api.post('/auth/google', { token: googleToken });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Google login failed');
    }
  };

  const logout = () => {
    // Clear token from both storage locations
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to send reset email');
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password', { token: resetToken, newPassword });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const loginWithGoogle = async () => {
    // This will be implemented with Google Sign-In SDK
    // For now, we'll use a placeholder implementation
    throw new Error('Google Sign-In not implemented yet');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    googleLogin,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
