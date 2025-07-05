import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Validate API key
if (!API_KEY) {
  console.error('ALPHA_VANTAGE_API_KEY is not set in environment variables');
  console.error('Please add your Alpha Vantage API key to the .env file');
}

export const getExchangeRate = async (from, to) => {
  if (!API_KEY) {
    throw new Error('Alpha Vantage API key is not configured');
  }
  
  try {
    const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API_KEY}`;
    console.log(`Fetching exchange rate: ${from} to ${to}`);
    
    const { data } = await axios.get(url);
    
    // Log API response for debugging
    if (data.Note || data['Error Message']) {
      console.warn('Alpha Vantage API warning/error:', data);
    }
    
    return data;
  } catch (error) {
    console.error('Alpha Vantage API error:', error.message);
    throw error;
  }
};

export const getHistoricalRates = async (from, to) => {
  if (!API_KEY) {
    throw new Error('Alpha Vantage API key is not configured');
  }
  
  try {
    const url = `${BASE_URL}?function=FX_DAILY&from_symbol=${from}&to_symbol=${to}&outputsize=compact&apikey=${API_KEY}`;
    console.log(`Fetching historical rates: ${from} to ${to}`);
    
    const { data } = await axios.get(url);
    
    // Log API response for debugging
    if (data.Note || data['Error Message']) {
      console.warn('Alpha Vantage API warning/error:', data);
    }
    
    return data;
  } catch (error) {
    console.error('Alpha Vantage API error:', error.message);
    throw error;
  }
}; 