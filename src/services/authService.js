import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && 
        error.response?.data?.code === 'TOKEN_EXPIRED' && 
        !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;
    
    localStorage.setItem('accessToken', token);
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });
    const { user, token } = response.data.data;
    
    localStorage.setItem('accessToken', token);
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  } catch (error) {
    // Even if logout fails on server, clear local storage
    localStorage.removeItem('accessToken');
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user || response.data.data?.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token verification failed');
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    const { accessToken } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    localStorage.removeItem('accessToken');
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};
