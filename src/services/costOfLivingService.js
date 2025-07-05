const FX_API_KEY = 'fxr_live_85df2a7fa01c54521924db8ee8db440b0823';
const MONGODB_URL = 'mongodb+srv://Ayush-yadav:ayush04@cluster0.kfhbvrm.mongodb.net/countries';

// Mock data for countries and cities
const mockCountries = [
  'United States', 'India', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Japan', 'China', 'Brazil', 'Mexico', 'Italy',
  'Spain', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark',
  'Finland', 'Poland', 'Czech Republic', 'Austria', 'Belgium', 'Ireland'
];

const mockCities = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
  'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chongqing', 'Chengdu', 'Nanjing', 'Wuhan', 'Xi\'an'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre']
};

// Get country suggestions based on input
export const getCountrySuggestions = async (query) => {
  try {
    if (!query || query.length < 2) return [];
    
    const filtered = mockCountries.filter(country => 
      country.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Country search error:', error);
    return [];
  }
};

// Get city suggestions based on country and input
export const getCitySuggestions = async (country, query) => {
  try {
    if (!country || !query || query.length < 2) return [];
    
    const cities = mockCities[country] || [];
    const filtered = cities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
};

// Get country by city
export const getCountryByCity = async (city) => {
  try {
    if (!city) return null;
    
    for (const [country, cities] of Object.entries(mockCities)) {
      if (cities.some(c => c.toLowerCase() === city.toLowerCase())) {
        return country;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Get country by city error:', error);
    return null;
  }
};

// Get exchange rate using the FX API
export const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    console.log(`Fetching exchange rate: 1 ${fromCurrency} = ? ${toCurrency}`);
    
    // First, try to get the rate from fromCurrency to toCurrency
    const response = await fetch(
      `https://api.fxratesapi.com/latest?currencies=${toCurrency}&base=${fromCurrency}&places=4&amount=1&api_key=${FX_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Exchange rate API error');
    }
    
    const rate = data.rates[toCurrency];
    console.log(`Direct rate: 1 ${fromCurrency} = ${rate} ${toCurrency}`);
    
    // If we got a valid rate, return it
    if (rate && rate > 0) {
      return rate;
    }
    
    // If the rate is too small or invalid, try the reverse direction
    console.log(`Trying reverse direction: 1 ${toCurrency} = ? ${fromCurrency}`);
    const reverseResponse = await fetch(
      `https://api.fxratesapi.com/latest?currencies=${fromCurrency}&base=${toCurrency}&places=4&amount=1&api_key=${FX_API_KEY}`
    );
    
    if (!reverseResponse.ok) {
      throw new Error('Failed to fetch reverse exchange rate');
    }
    
    const reverseData = await reverseResponse.json();
    
    if (!reverseData.success) {
      throw new Error('Reverse exchange rate API error');
    }
    
    const reverseRate = reverseData.rates[fromCurrency];
    console.log(`Reverse rate: 1 ${toCurrency} = ${reverseRate} ${fromCurrency}`);
    
    // Return the inverse of the reverse rate
    const finalRate = reverseRate ? 1 / reverseRate : null;
    console.log(`Final rate: 1 ${fromCurrency} = ${finalRate} ${toCurrency}`);
    
    return finalRate;
    
  } catch (error) {
    console.error('Exchange rate error:', error);
    return null;
  }
};

// Get cost of living data (using the existing API)
export const getCostOfLivingData = async (city, country) => {
  const RAPIDAPI_KEY = '76383b9f53msh2a1e0f9484ccb8ap1480e9jsnffc2cc180c52';
  const RAPIDAPI_HOST = 'cost-of-living-and-prices.p.rapidapi.com';
  
  try {
    const response = await fetch(
      `https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${city}&country_name=${country}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch cost of living data');
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Cost of living error:', error);
    throw error;
  }
};

// Calculate the actual average cost from API data
export const calculateActualAverageCost = (prices) => {
  if (!prices || !Array.isArray(prices)) return 0;
  
  let totalCost = 0;
  let itemCount = 0;
  
  prices.forEach(item => {
    const avgValue = Number(item.usd?.avg || item.avg || 0);
    if (!isNaN(avgValue) && avgValue > 0) {
      totalCost += avgValue;
      itemCount++;
    }
  });
  
  return itemCount > 0 ? totalCost / itemCount : 0;
};

// Calculate total cost from API data
export const calculateTotalCostFromAPI = (prices) => {
  if (!prices || !Array.isArray(prices)) return 0;
  
  return prices.reduce((total, item) => {
    const avgValue = Number(item.usd?.avg || item.avg || 0);
    return total + (isNaN(avgValue) ? 0 : avgValue);
  }, 0);
};

// Calculate detailed cost breakdown for each category
export const calculateCategoryCosts = (prices, categoriesToShow) => {
  const categoryCosts = {};
  
  Object.keys(categoriesToShow).forEach(category => {
    const items = prices.filter(p => p.category_name === category);
    if (items.length > 0) {
      const total = items.reduce((sum, item) => {
        const value = Number(item.usd?.avg || item.avg || 0);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      
      categoryCosts[category] = {
        items: items,
        total: total,
        average: total / items.length
      };
    }
  });
  
  return categoryCosts;
};

// Calculate total cost of living
export const calculateTotalCostOfLiving = (categoryCosts) => {
  const total = Object.values(categoryCosts).reduce((sum, category) => {
    return sum + category.total;
  }, 0);
  
  return total;
};

// Convert cost to another currency
export const convertCostToCurrency = (costBreakdown, targetCurrency, currencySymbols) => {
  if (!costBreakdown || !targetCurrency) return null;
  
  const { totalCost, exchangeRate } = costBreakdown;
  
  if (!totalCost || !exchangeRate) return null;
  
  let convertedCost = totalCost * exchangeRate;
  const symbol = currencySymbols?.[targetCurrency] || targetCurrency;
  
  return {
    ...costBreakdown,
    convertedCost: convertedCost.toFixed(2),
    targetCurrency: targetCurrency,
    targetSymbol: symbol
  };
};