import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData && config.headers && typeof config.headers === 'object') {
      delete (config.headers as Record<string, unknown>)['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  googleLogin: (data: { token: string }) =>
    api.post('/auth/google', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured/list'),
  search: (query: string, category?: string) =>
    api.get('/products/search/query', { params: { q: query, category } }),
};

// Orders API
export const ordersAPI = {
  create: (orderData: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      color?: string;
      size?: string;
      image?: string;
      id?: string;
      product?: string;
    }>;
    shippingAddress: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      postalCode: string;
    };
  }) => api.post('/orders', orderData),
  getMyOrders: (params?: { page?: number; limit?: number }) =>
    api.get('/orders/my-orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// User API
export const userAPI = {
  addToFavorites: (productId: string) =>
    api.post('/user/favorites', { productId }),
  removeFromFavorites: (productId: string) =>
    api.delete(`/user/favorites/${productId}`),
  getFavorites: () => api.get('/user/favorites'),
  updateProfile: (data: { name: string }) =>
    api.patch('/user/profile', data),
};

// Tools API
export const toolsAPI = {
  convertFile: (file: File, sourceFormat: string, targetFormat: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceFormat', sourceFormat);
    formData.append('targetFormat', targetFormat);
    return api.post('/tools/convert-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  countStitches: (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post('/tools/count-stitches', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  estimatePrice: (data: {
    image: File;
    productType: string;
    size: string;
    color: string;
    includeProduct: boolean;
    stitchCount?: number;
  }) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('productType', data.productType);
    formData.append('size', data.size);
    formData.append('color', data.color);
    formData.append('includeProduct', data.includeProduct.toString());
    if (data.stitchCount) {
      formData.append('stitchCount', data.stitchCount.toString());
    }
    return api.post('/tools/estimate-price', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Payments API (amount is taken from the order on the server)
export const paymentsAPI = {
  initiate: (data: { orderId: string; email: string }) =>
    api.post('/payments/initiate', data),
  verify: (reference: string) => api.post('/payments/verify', { reference }),
};

/** Logo digitizing: multipart form (logo + fields) creates order; then call payments.initiate. */
export const digitizingRequestsAPI = {
  create: (formData: FormData) => api.post('/digitizing-requests', formData),
};

/** Project quote requests (auth); optional reference file as field name `reference`. */
export const quoteRequestsAPI = {
  create: (formData: FormData) => api.post('/quote-requests', formData),
  getMy: () => api.get('/quote-requests/my'),
};

export default api;
