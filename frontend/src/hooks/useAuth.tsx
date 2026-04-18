import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import { AUTH_RETURN_KEY } from '../utils/pendingForms';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const loginWithGoogle = () => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ||
      '';
    if (!clientId) {
      return Promise.reject(new Error('Google client ID is not configured (VITE_GOOGLE_CLIENT_ID)'));
    }

    return new Promise<void>((resolve, reject) => {
      const google = (window as { google?: unknown }).google as
        | { accounts?: { oauth2?: { initTokenClient: (opts: unknown) => { requestAccessToken: () => void } } } }
        | undefined;
      if (!google?.accounts?.oauth2) {
        reject(new Error('Google Sign-In not available'));
        return;
      }

      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: { access_token?: string; error?: string }) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error));
            return;
          }
          if (!tokenResponse.access_token) {
            reject(new Error('No access token from Google'));
            return;
          }
          try {
            const response = await authAPI.googleLogin({ token: tokenResponse.access_token });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            resolve();
          } catch (error: unknown) {
            const msg =
              error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : null;
            reject(new Error(msg || 'Google login failed'));
          }
        },
      });

      client.requestAccessToken();
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem(AUTH_RETURN_KEY);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
