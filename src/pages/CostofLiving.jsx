import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  MapPin, 
  Globe, 
  Building,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { countryCurrencyMap, currencySymbols } from '../components/CountryCurrencyMap.js';
import { 
  CategoryCard, 
  ExchangeRateCard, 
  SuggestionInput
} from '../components/CostOfLivingComponents.jsx';
import { 
  getCountrySuggestions, 
  getCitySuggestions, 
  getCountryByCity, 
  getExchangeRate, 
  getCostOfLivingData,
  calculateCategoryCosts,
  calculateTotalCostOfLiving,
  calculateActualAverageCost,
  calculateTotalCostFromAPI
} from '../services/costOfLivingService.js';

// Import icons
import { 
  Home, 
  Utensils, 
  Car, 
  Zap, 
  DollarSign, 
  ShoppingCart 
} from 'lucide-react';

const categoriesToShow = {
  'Rent Per Month': { title: 'Housing (Rent)', icon: 'Home' },
  'Restaurants': { title: 'Restaurants', icon: 'Utensils' },
  'Transportation': { title: 'Transportation', icon: 'Car' },
  'Utilities Per Month': { title: 'Utilities', icon: 'Zap' },
  'Salaries And Financing': { title: 'Salary', icon: 'DollarSign' },
  'Markets': { title: 'Groceries', icon: 'ShoppingCart' },
};

const iconMap = {
  Home,
  Utensils,
  Car,
  Zap,
  DollarSign,
  ShoppingCart,
};

const CostofLiving = () => {
  const [form, setForm] = useState({
    sourceCountry: '',
    destinationCountry: '',
    destinationCity: '',
  });
  
  const [suggestions, setSuggestions] = useState({
    sourceCountries: [],
    destinationCountries: [],
    cities: [],
  });
  
  const [loading, setLoading] = useState({
    sourceCountries: false,
    destinationCountries: false,
    cities: false,
    calculation: false,
  });
  
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState(null);

  // Get currency symbol helper function
  const getCurrencySymbol = (country) => {
    const currencyCode = countryCurrencyMap[country];
    return currencySymbols[currencyCode] || currencyCode || '$';
  };

  // Debounced search function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Handle country suggestions
  const handleCountrySearch = useCallback(
    debounce(async (query, type) => {
      if (!query || query.length < 2) {
        setSuggestions(prev => ({ ...prev, [type]: [] }));
        return;
      }

      setLoading(prev => ({ ...prev, [type]: true }));
      try {
        const results = await getCountrySuggestions(query);
        setSuggestions(prev => ({ ...prev, [type]: results }));
      } catch (error) {
        console.error('Country search error:', error);
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }));
      }
    }, 300),
    []
  );

  // Handle city suggestions
  const handleCitySearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2 || !form.destinationCountry) {
        setSuggestions(prev => ({ ...prev, cities: [] }));
        return;
      }

      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const results = await getCitySuggestions(form.destinationCountry, query);
        setSuggestions(prev => ({ ...prev, cities: results }));
      } catch (error) {
        console.error('City search error:', error);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    }, 300),
    [form.destinationCountry]
  );

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');

    // Trigger suggestions based on field type
    if (name === 'sourceCountry') {
      handleCountrySearch(value, 'sourceCountries');
    } else if (name === 'destinationCountry') {
      handleCountrySearch(value, 'destinationCountries');
    } else if (name === 'destinationCity') {
      handleCitySearch(value);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (value, field) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSuggestions(prev => ({ ...prev, [field === 'sourceCountry' ? 'sourceCountries' : field === 'destinationCountry' ? 'destinationCountries' : 'cities']: [] }));
    
    // If city is selected first, find the country
    if (field === 'destinationCity' && !form.destinationCountry) {
      getCountryByCity(value).then(country => {
        if (country) {
          setForm(prev => ({ ...prev, destinationCountry: country }));
        }
      });
    }
  };

  // Calculate costs from API data
  const calculateCostsFromAPI = (prices) => {
    if (!prices || !Array.isArray(prices)) {
      return {
        averageCost: 0,
        totalCost: 0,
        categoryCosts: {}
      };
    }

    const averageCost = calculateActualAverageCost(prices);
    const totalCost = calculateTotalCostFromAPI(prices);
    const categoryCosts = calculateCategoryCosts(prices, categoriesToShow);

    console.log('API Data Analysis:', {
      totalItems: prices.length,
      averageCost,
      totalCost,
      categoryBreakdown: categoryCosts
    });

    return {
      averageCost,
      totalCost,
      categoryCosts
    };
  };

  // Fetch cost of living data
  const fetchCostOfLiving = async () => {
    setLoading(prev => ({ ...prev, calculation: true }));
    setError('');
    setResult(null);
    setExchangeRate(null);
    setCostBreakdown(null);

    try {
      // Get cost of living data
      const costData = await getCostOfLivingData(form.destinationCity, form.destinationCountry);
      setResult(costData);

      // Calculate costs from API data
      if (costData.prices) {
        const breakdown = calculateCostsFromAPI(costData.prices);
        setCostBreakdown(breakdown);
      }

      // Get exchange rate
      const sourceCurrency = countryCurrencyMap[form.sourceCountry];
      const destinationCurrency = countryCurrencyMap[form.destinationCountry];
      
      if (sourceCurrency && destinationCurrency) {
        // Get rate from destination currency to source currency
        // This will convert destination costs to source currency
        const rate = await getExchangeRate(destinationCurrency, sourceCurrency);
        setExchangeRate(rate);
      }

    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(prev => ({ ...prev, calculation: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.sourceCountry && form.destinationCountry && form.destinationCity) {
      fetchCostOfLiving();
    } else {
      setError('Please fill in all fields');
    }
  };

  // Default data for demonstration (all set to 0)
  const defaultData = {
    'Rent Per Month': [
      { item_name: 'Apartment (1 bedroom) in City Centre', usd: { avg: 0 } },
      { item_name: 'Apartment (1 bedroom) Outside of Centre', usd: { avg: 0 } },
      { item_name: 'Apartment (3 bedrooms) in City Centre', usd: { avg: 0 } }
    ],
    'Restaurants': [
      { item_name: 'Meal, Inexpensive Restaurant', usd: { avg: 0 } },
      { item_name: 'Meal for 2 People, Mid-range Restaurant', usd: { avg: 0 } },
      { item_name: 'Cappuccino (regular)', usd: { avg: 0 } }
    ],
    'Transportation': [
      { item_name: 'One-way Ticket (Local Transport)', usd: { avg: 0 } },
      { item_name: 'Monthly Pass (Regular Price)', usd: { avg: 0 } },
      { item_name: 'Taxi Start (Normal Tariff)', usd: { avg: 0 } }
    ],
    'Utilities Per Month': [
      { item_name: 'Basic (Electricity, Heating, Cooling, Water, Garbage)', usd: { avg: 0 } },
      { item_name: '1 min. of Prepaid Mobile Tariff Local', usd: { avg: 0 } },
      { item_name: 'Internet (60 Mbps or More, Unlimited Data)', usd: { avg: 0 } }
    ],
    'Salaries And Financing': [
      { item_name: 'Average Monthly Net Salary', usd: { avg: 0 } },
      { item_name: 'Mortgage Interest Rate in Percentages', usd: { avg: 0 } }
    ],
    'Markets': [
      { item_name: 'Milk (regular), (1 liter)', usd: { avg: 0 } },
      { item_name: 'Loaf of Fresh White Bread (500g)', usd: { avg: 0 } },
      { item_name: 'Rice (white), (1kg)', usd: { avg: 0 } }
    ]
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Smart Cost of Living Calculator
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Compare Living Costs
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Compare living costs between countries and cities with real-time exchange rates and detailed breakdowns
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 mb-12"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl" padding="xl">
          <div className="flex items-center mb-6">
            <Calculator className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Compare Living Costs</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Country inputs side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SuggestionInput
                label="Source Country"
                value={form.sourceCountry}
                onChange={handleChange}
                placeholder="e.g. United States"
                suggestions={suggestions.sourceCountries}
                onSuggestionClick={(value) => handleSuggestionClick(value, 'sourceCountry')}
                icon={Globe}
                loading={loading.sourceCountries}
              />
              
              <SuggestionInput
                label="Destination Country"
                value={form.destinationCountry}
                onChange={handleChange}
                placeholder="e.g. Germany"
                suggestions={suggestions.destinationCountries}
                onSuggestionClick={(value) => handleSuggestionClick(value, 'destinationCountry')}
                icon={Globe}
                loading={loading.destinationCountries}
              />
            </div>
            
            {/* City input below destination country */}
            <div className="max-w-md">
              <SuggestionInput
                label="Destination City"
                value={form.destinationCity}
                onChange={handleChange}
                placeholder="e.g. Berlin"
                suggestions={suggestions.cities}
                onSuggestionClick={(value) => handleSuggestionClick(value, 'destinationCity')}
                icon={Building}
                loading={loading.cities}
              />
            </div>
            
            <Button 
              type="submit" 
              loading={loading.calculation} 
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Calculate Cost of Living
            </Button>
          </form>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Results Section */}
      {loading.calculation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto px-4 mb-8"
        >
          <Card className="text-center" padding="xl">
            <div className="animate-pulse">
              <Calculator className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <div className="text-lg text-primary-600 dark:text-primary-400">Calculating cost of living data...</div>
            </div>
          </Card>
        </motion.div>
      )}

      {result && costBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 space-y-8"
        >
          {/* Exchange Rate Card */}
          <ExchangeRateCard
            sourceCountry={form.destinationCountry}
            destinationCountry={form.sourceCountry}
            exchangeRate={exchangeRate}
            sourceCurrency={countryCurrencyMap[form.destinationCountry]}
            destinationCurrency={countryCurrencyMap[form.sourceCountry]}
            sourceSymbol={getCurrencySymbol(form.destinationCountry)}
            destinationSymbol={getCurrencySymbol(form.sourceCountry)}
          />

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoriesToShow).map(([category, config]) => {
              const items = result.prices?.filter((p) => p.category_name === category) || defaultData[category] || [];
              if (!items.length) return null;
              
              const Icon = iconMap[config.icon];
              
              return (
                <CategoryCard
                  key={category}
                  title={config.title}
                  icon={Icon}
                  items={items}
                  exchangeRate={exchangeRate}
                  sourceCurrency={countryCurrencyMap[form.sourceCountry]}
                  sourceSymbol={getCurrencySymbol(form.sourceCountry)}
                  destinationSymbol={getCurrencySymbol(form.destinationCountry)}
                />
              );
            })}
          </div>

          {/* API Data Debug Info */}
          <Card className="bg-gray-50 dark:bg-gray-800" padding="lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">API Data Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Total Items from API:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{result.prices?.length || 0}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Average Cost ({countryCurrencyMap[form.destinationCountry] || 'USD'}):</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{getCurrencySymbol(form.destinationCountry)}{costBreakdown.averageCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Total Cost ({countryCurrencyMap[form.destinationCountry] || 'USD'}):</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{getCurrencySymbol(form.destinationCountry)}{costBreakdown.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Default Demo Section */}
      {!result && !loading.calculation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-7xl mx-auto px-4 space-y-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Sample Cost Breakdown
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your locations above to see real data, or explore this sample breakdown
            </p>
          </div>

          {/* Demo Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoriesToShow).map(([category, config]) => {
              const items = defaultData[category] || [];
              const Icon = iconMap[config.icon];
              
              return (
                <CategoryCard
                  key={category}
                  title={config.title}
                  icon={Icon}
                  items={items}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CostofLiving;


//https://api.fxratesapi.com/latest?api_key=fxr_live_85df2a7fa01c54521924db8ee8db440b0823
