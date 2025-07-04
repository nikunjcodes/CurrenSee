import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

const MarketAnalysis = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPair, setSelectedPair] = useState('USD/EUR');
  const [chartData, setChartData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [newsData, setNewsData] = useState([]);

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '365d', label: '1 Year' },
  ];

  const currencyPairs = [
    'USD/EUR', 'USD/GBP', 'USD/JPY', 'USD/CAD', 'USD/AUD',
    'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/CAD', 'CHF/JPY'
  ];

  useEffect(() => {
    generateChartData();
    generateHeatmapData();
    generateNewsData();
  }, [selectedPeriod, selectedPair]);

  const generateChartData = () => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 365;
    const baseValue = 0.8473; // USD to EUR base rate
    
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const value = baseValue + variation;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: value,
        displayDate: date.toLocaleDateString(),
        change: variation > 0 ? 'up' : 'down'
      });
    }
    
    setChartData(data);
  };

  const generateHeatmapData = () => {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
    const data = currencies.map(currency => ({
      currency,
      strength: Math.random() * 100,
      change: (Math.random() - 0.5) * 10,
      volatility: Math.random() * 20 + 5
    }));
    
    setHeatmapData(data);
  };

  const generateNewsData = () => {
    const news = [
      { 
        currency: 'USD', 
        sentiment: 'positive', 
        headline: 'Federal Reserve signals stable interest rates',
        impact: 'high',
        time: '2 hours ago'
      },
      { 
        currency: 'EUR', 
        sentiment: 'neutral', 
        headline: 'ECB maintains current monetary policy',
        impact: 'medium',
        time: '4 hours ago'
      },
      { 
        currency: 'GBP', 
        sentiment: 'negative', 
        headline: 'UK inflation concerns persist',
        impact: 'high',
        time: '6 hours ago'
      },
      { 
        currency: 'JPY', 
        sentiment: 'positive', 
        headline: 'Bank of Japan intervention supports yen',
        impact: 'medium',
        time: '8 hours ago'
      },
    ];
    
    setNewsData(news);
  };

  const getStrengthColor = (strength) => {
    if (strength >= 70) return 'bg-green-500';
    if (strength >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Market Analysis
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Advanced currency market insights and trend analysis
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`p-6 rounded-2xl shadow-lg mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Currency Pair
              </label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {currencyPairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Period
              </label>
              <div className="flex space-x-2">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedPeriod === period.value
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                        : theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Historical Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`p-6 rounded-2xl shadow-lg mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {selectedPair} Historical Chart
            </h2>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  domain={['dataMin - 0.01', 'dataMax + 0.01']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Currency Strength Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`p-6 rounded-2xl shadow-lg mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-6 h-6 text-primary-600" />
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Currency Strength Heatmap
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {heatmapData.map((currency, index) => (
              <motion.div
                key={currency.currency}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {currency.currency}
                  </span>
                  <div className="flex items-center space-x-1">
                    {currency.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${currency.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {currency.change > 0 ? '+' : ''}{currency.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Strength
                    </span>
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {currency.strength.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStrengthColor(currency.strength)}`}
                      style={{ width: `${currency.strength}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Volatility: {currency.volatility.toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market News & Sentiment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={`p-6 rounded-2xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <AlertCircle className="w-6 h-6 text-primary-600" />
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Market News & Sentiment
            </h2>
          </div>

          <div className="space-y-4">
            {newsData.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  news.sentiment === 'positive' ? 'border-green-500 bg-green-50 dark:bg-green-900' :
                  news.sentiment === 'negative' ? 'border-red-500 bg-red-50 dark:bg-red-900' :
                  'border-yellow-500 bg-yellow-50 dark:bg-yellow-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {news.currency}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        news.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        news.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {news.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {news.headline}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {news.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSentimentIcon(news.sentiment)}
                    <span className={`text-sm font-medium ${getSentimentColor(news.sentiment)}`}>
                      {news.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
