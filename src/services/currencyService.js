import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getExchangeRates = async (base = 'USD') => {
  try {
    const response = await api.get(`/currency/rates?base=${base}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch exchange rates');
  }
};

export const convertCurrency = async (from, to, amount) => {
  try {
    const response = await api.post('/currency/convert', { from, to, amount });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to convert currency');
  }
};

export const getHistoricalData = async (from, to, period = '7d') => {
  try {
    const response = await api.get(`/currency/history?from=${from}&to=${to}&period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch historical data');
  }
};

export const getCurrencyNews = async (currency) => {
  try {
    const response = await api.get(`/currency/news?currency=${currency}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch currency news');
  }
};

export const getMarketAnalysis = async () => {
  try {
    const response = await api.get('/currency/analysis');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch market analysis');
  }
};
