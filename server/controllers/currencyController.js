import { getExchangeRate, getHistoricalRates } from '../config/alphaVantage.js';
import Currency from '../models/Currency.js';

export const testAPI = async (req, res) => {
  try {
    // Test with a simple currency pair
    const data = await getExchangeRate('USD', 'EUR');
    
    if (data['Error Message']) {
      return res.status(502).json({ 
        error: 'API Key Error', 
        message: data['Error Message'],
        details: 'Please check your Alpha Vantage API key'
      });
    }
    
    if (data.Note) {
      return res.status(429).json({ 
        error: 'Rate Limit', 
        message: data.Note,
        details: 'API rate limit exceeded. Please try again later.'
      });
    }
    
    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      return res.status(502).json({ 
        error: 'Invalid Response', 
        message: 'No exchange rate found in response',
        details: 'The API response format might have changed'
      });
    }
    
    res.json({ 
      success: true, 
      message: 'API is working correctly',
      testRate: `USD to EUR: ${rate}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('API test error:', err);
    res.status(500).json({ 
      error: 'API Test Failed', 
      message: err.message,
      details: 'Check your API key and network connection'
    });
  }
};

export const fetchExchangeRate = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'Missing from or to currency' });
    
    const data = await getExchangeRate(from, to);
    
    // Check for API errors
    if (data['Error Message']) {
      return res.status(502).json({ error: data['Error Message'] });
    }
    
    if (data.Note) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    
    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      return res.status(502).json({ error: 'Failed to fetch valid exchange rate from provider.' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Exchange rate error:', err);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
};

export const fetchHistoricalRates = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'Missing from or to currency' });
    
    const data = await getHistoricalRates(from, to);
    
    // Check for API errors
    if (data['Error Message']) {
      return res.status(502).json({ error: data['Error Message'] });
    }
    
    if (data.Note) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    
    const series = data['Time Series FX (Daily)'];
    if (!series) {
      // If no historical data, return a more helpful error
      return res.status(502).json({ 
        error: 'No historical data available for this currency pair. This might be due to API limitations or invalid currency codes.' 
      });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Historical rates error:', err);
    res.status(500).json({ error: 'Failed to fetch historical rates' });
  }
};

export const getSupportedCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find({});
    if (!currencies || currencies.length === 0) {
      // No currencies found, return empty array
      return res.json([]);
    }
    // Map fields to match frontend expectations
    const mapped = currencies.map(c => {
      // Defensive: fallback to _doc if direct access fails
      const doc = c._doc || c;
      return {
        code: doc["currency code"] || doc.code || "",
        name: doc["currency name"] || doc.name || "",
        symbol: doc.symbol || ""
      };
    });
    res.json(mapped);
  } catch (err) {
    console.error('Supported currencies error:', err);
    res.status(500).json({ error: 'Failed to fetch supported currencies' });
  }
}; 