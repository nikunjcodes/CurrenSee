"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  BarChart3, 
  Calendar,
  RefreshCw,
  AlertTriangle,
  Target,
  ArrowRight,
  Zap,
  Activity,
  TrendingUpIcon
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { apiService } from "../services/api.js";
import { SimpleLinearRegression } from "ml-regression";
import { PolynomialRegression } from "ml-regression-polynomial";
import { ExponentialRegression } from "ml-regression-exponential";
import { PowerRegression } from "ml-regression-power";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const PERIODS = [7, 30, 90];
const DEFAULT_FROM = "USD";
const DEFAULT_TO = "EUR";

// Calculate moving averages
function calculateMovingAverages(data, periods = [5, 10, 20]) {
  const movingAverages = {};
  
  periods.forEach(period => {
    if (data.length >= period) {
      const ma = [];
      for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
        ma.push(sum / period);
      }
      movingAverages[`MA${period}`] = ma;
    }
  });
  
  return movingAverages;
}

// Calculate R-squared (coefficient of determination)
function calculateRSquared(actual, predicted) {
  const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  const ssRes = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  const ssTot = actual.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  return 1 - (ssRes / ssTot);
}

// Calculate volatility
function calculateVolatility(data) {
  const returns = [];
  for (let i = 1; i < data.length; i++) {
    returns.push((data[i].close - data[i-1].close) / data[i-1].close);
  }
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
}

function extractClosePrices(timeSeries, days) {
  if (!timeSeries || typeof timeSeries !== 'object') {
    throw new Error('Invalid time series data received');
  }
  
  const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
  if (dates.length === 0) {
    throw new Error('No date data available in time series');
  }
  
  return dates.slice(0, days).map(date => {
    const dayData = timeSeries[date];
    if (!dayData || !dayData["4. close"]) {
      throw new Error(`Missing close price data for date: ${date}`);
    }
    
    const closePrice = parseFloat(dayData["4. close"]);
    if (isNaN(closePrice)) {
      throw new Error(`Invalid close price for date: ${date}`);
    }
    
    return {
      date,
      close: closePrice
    };
  }).reverse(); // oldest to newest
}

function runAdvancedAnalysis(data) {
  if (!Array.isArray(data) || data.length < 5) {
    return null;
  }
  
  try {
    const x = data.map((_, i) => i);
    const y = data.map(d => d.close);
    
    // Validate that all y values are valid numbers
    if (y.some(val => isNaN(val) || !isFinite(val))) {
      throw new Error('Invalid data points detected');
    }
    
    const models = [];
    
    // Linear Regression
    try {
      const linearRegression = new SimpleLinearRegression(x, y);
      const linearPredicted = linearRegression.predict(x.length);
      const linearRSquared = calculateRSquared(y, x.map(xi => linearRegression.predict(xi)));
      
      if (isFinite(linearPredicted) && isFinite(linearRSquared)) {
        models.push({
          name: 'Linear',
          rSquared: linearRSquared,
          predicted: linearPredicted,
          slope: linearRegression.slope || 0
        });
      }
    } catch (error) {
      console.warn('Linear regression failed:', error);
    }
    
    // Polynomial Regression (degree 2)
    try {
      const polynomialRegression = new PolynomialRegression(x, y, 2);
      const polyPredicted = polynomialRegression.predict(x.length);
      const polyRSquared = calculateRSquared(y, x.map(xi => polynomialRegression.predict(xi)));
      
      if (isFinite(polyPredicted) && isFinite(polyRSquared)) {
        models.push({
          name: 'Polynomial',
          rSquared: polyRSquared,
          predicted: polyPredicted,
          slope: polynomialRegression.slope || 0
        });
      }
    } catch (error) {
      console.warn('Polynomial regression failed:', error);
    }
    
    // Exponential Regression
    try {
      const exponentialRegression = new ExponentialRegression(x, y);
      const expPredicted = exponentialRegression.predict(x.length);
      const expRSquared = calculateRSquared(y, x.map(xi => exponentialRegression.predict(xi)));
      
      if (isFinite(expPredicted) && isFinite(expRSquared)) {
        models.push({
          name: 'Exponential',
          rSquared: expRSquared,
          predicted: expPredicted,
          slope: exponentialRegression.slope || 0
        });
      }
    } catch (error) {
      console.warn('Exponential regression failed:', error);
    }
    
    // Power Regression
    try {
      const powerRegression = new PowerRegression(x, y);
      const powerPredicted = powerRegression.predict(x.length);
      const powerRSquared = calculateRSquared(y, x.map(xi => powerRegression.predict(xi)));
      
      if (isFinite(powerPredicted) && isFinite(powerRSquared)) {
        models.push({
          name: 'Power',
          rSquared: powerRSquared,
          predicted: powerPredicted,
          slope: powerRegression.slope || 0
        });
      }
    } catch (error) {
      console.warn('Power regression failed:', error);
    }
    
    // If no models worked, return null
    if (models.length === 0) {
      throw new Error('All regression models failed');
    }
    
    // Moving Averages
    const movingAverages = calculateMovingAverages(data);
    
    // Volatility
    const volatility = calculateVolatility(data);
    
    // Find best model based on R-squared
    const bestModel = models.reduce((best, current) => 
      current.rSquared > best.rSquared ? current : best
    );
    
    return {
      models,
      bestModel,
      movingAverages,
      volatility,
      currentPrice: y[y.length - 1],
      priceChange: y[y.length - 1] - y[0],
      priceChangePercent: ((y[y.length - 1] - y[0]) / y[0]) * 100
    };
  } catch (error) {
    console.error('Advanced analysis error:', error);
    return null;
  }
}

function getAdvancedAdvice(analysis) {
  if (!analysis || !analysis.bestModel) return null;
  
  const { bestModel, volatility, priceChangePercent } = analysis;
  
  // Ensure we have valid values
  const slope = bestModel.slope || 0;
  const vol = volatility || 0;
  const priceChange = priceChangePercent || 0;
  
  // Determine trend strength
  let trendStrength = 'weak';
  if (Math.abs(slope) > 0.01) trendStrength = 'strong';
  else if (Math.abs(slope) > 0.005) trendStrength = 'moderate';
  
  // Determine volatility level
  let volatilityLevel = 'low';
  if (vol > 0.3) volatilityLevel = 'high';
  else if (vol > 0.15) volatilityLevel = 'medium';
  
  // Generate comprehensive advice
  let action = 'HOLD';
  let confidence = 'medium';
  let reasoning = [];
  
  if (slope > 0.01 && priceChange > 2) {
    action = 'BUY';
    confidence = 'high';
    reasoning.push('Strong upward trend detected');
    reasoning.push('Positive price momentum');
  } else if (slope < -0.01 && priceChange < -2) {
    action = 'SELL';
    confidence = 'high';
    reasoning.push('Strong downward trend detected');
    reasoning.push('Negative price momentum');
  } else if (Math.abs(slope) < 0.005) {
    action = 'HOLD';
    confidence = 'high';
    reasoning.push('Stable trend with low volatility');
  } else {
    action = 'HOLD';
    confidence = 'medium';
    reasoning.push('Mixed signals - wait for clearer trend');
  }
  
  if (volatilityLevel === 'high') {
    reasoning.push('High volatility - consider risk management');
  }
  
  return {
    action,
    confidence,
    reasoning,
    trendStrength,
    volatilityLevel,
    modelAccuracy: bestModel.rSquared ? (bestModel.rSquared * 100).toFixed(1) : 'N/A',
    color: action === 'BUY' ? 'text-green-600' : action === 'SELL' ? 'text-red-600' : 'text-gray-600',
    bgColor: action === 'BUY' ? 'bg-green-100 dark:bg-green-900' : 
             action === 'SELL' ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-800',
    icon: action === 'BUY' ? TrendingUp : action === 'SELL' ? TrendingDown : BarChart3
  };
}

const AIPrediction = () => {
  const { theme } = useTheme();
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});
  const [rawData, setRawData] = useState(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const fetchAndPredict = async () => {
    if (!from || !to || from === to) {
      setError("Please select different currencies for analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults({});
    setRawData(null);
    setHasAnalyzed(false);
    
    try {
      const data = await apiService.getHistoricalRates(from, to);
      const series = data["Time Series FX (Daily)"];
      if (!series) throw new Error("No historical data available for this currency pair.");
      setRawData(series);
      const periodResults = {};
      for (const period of PERIODS) {
        const closes = extractClosePrices(series, period);
        if (closes.length < 5) {
          throw new Error(`Insufficient data for ${period}-day analysis. Need at least 5 data points for advanced algorithms.`);
        }
        const regression = runAdvancedAnalysis(closes);
        periodResults[period] = { closes, regression };
      }
      setResults(periodResults);
      setHasAnalyzed(true);
    } catch (err) {
      console.error('AI Prediction error:', err);
      setError(err.message || "Failed to fetch or process data. Please check your currency pair and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Analyzing currency trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className={`text-3xl lg:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Advanced AI Currency Analysis 🤖
              </h1>
              <p className={`mt-2 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Multi-algorithm machine learning analysis with polynomial, exponential, and power regression
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Linear Regression
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Polynomial Regression
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Exponential Regression
                </span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                  Power Regression
                </span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                  Moving Averages
                </span>
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                  Volatility Analysis
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currency Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card padding="lg">
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Select Currency Pair
            </h2>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  From Currency
                </label>
                <input 
                  value={from} 
                  onChange={e => setFrom(e.target.value.toUpperCase())} 
                  className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  maxLength={3} 
                  placeholder="USD"
                />
              </div>
              <div className="flex items-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  To Currency
                </label>
                <input 
                  value={to} 
                  onChange={e => setTo(e.target.value.toUpperCase())} 
                  className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  maxLength={3} 
                  placeholder="EUR"
                />
              </div>
              <div className="flex-1 flex justify-center">
                <Button
                  onClick={fetchAndPredict}
                  variant="primary"
                  size="lg"
                  icon={<Brain className="w-5 h-5" />}
                  disabled={loading || !from || !to || from === to}
                  className="px-8"
                >
                  {loading ? 'Analyzing...' : 'Analyze with AI'}
                </Button>
              </div>
            </div>
            {from === to && from && to && (
              <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Please select different currencies for analysis.
                </p>
              </div>
            )}
            <div className="mt-4 text-sm text-gray-500">
              <p>💡 Try popular pairs like: USD/EUR, EUR/GBP, USD/JPY, GBP/USD</p>
            </div>
          </Card>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <Card padding="lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Analysis Error
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {error}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Results - Only show after analysis */}
        {!loading && !error && hasAnalyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            {PERIODS.map((period, index) => {
              const res = results[period];
              if (!res) return null;
              const { closes, regression } = res;
              const advice = regression ? getAdvancedAdvice(regression) : null;
              
              return (
                <Card key={period} padding="lg" hover>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {period} Days Analysis
                      </h2>
                    </div>
                    {advice && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${advice.bgColor} ${advice.color}`}>
                        {advice.action}
                      </div>
                    )}
                  </div>

                  {/* Prediction Results */}
                  {regression && (
                    <div className="space-y-6">
                      {/* Best Model Prediction */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                          <div className="text-2xl font-bold">
                            {regression.bestModel?.predicted ? regression.bestModel.predicted.toFixed(4) : 'N/A'}
                          </div>
                          <div className="text-sm opacity-90">Best Model Prediction</div>
                          <div className="text-xs opacity-75 mt-1">
                            {regression.bestModel?.name || 'Unknown'} Model
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className={`text-2xl font-bold ${advice.color}`}>
                            {regression.bestModel?.slope ? (regression.bestModel.slope > 0 ? '+' : '') + regression.bestModel.slope.toFixed(4) : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">Trend Slope</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {regression.volatility ? regression.volatility.toFixed(2) : 'N/A'}%
                          </div>
                          <div className="text-sm text-gray-500">Volatility</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {regression.priceChangePercent ? (regression.priceChangePercent > 0 ? '+' : '') + regression.priceChangePercent.toFixed(2) : 'N/A'}%
                          </div>
                          <div className="text-sm text-gray-500">Price Change</div>
                        </div>
                      </div>

                      {/* Model Comparison */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Model Performance Comparison
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {regression.models.map((model, index) => (
                            <div key={model.name} className={`p-3 rounded-lg ${
                              model.name === regression.bestModel?.name 
                                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-600' 
                                : 'bg-white dark:bg-gray-600'
                            }`}>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {model.name}
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                {model.rSquared ? (model.rSquared * 100).toFixed(1) : 'N/A'}%
                              </div>
                              <div className="text-xs text-gray-500">Accuracy</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Pred: {model.predicted ? model.predicted.toFixed(4) : 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Moving Averages */}
                      {Object.keys(regression.movingAverages).length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Moving Averages
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.entries(regression.movingAverages).map(([period, values]) => (
                              <div key={period} className="p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {period}
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {values && values.length > 0 ? values[values.length - 1].toFixed(4) : 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Latest Value
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Data Table */}
                  <div className="mb-4">
                    <h3 className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Historical Data Used
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className={`border-b ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
                            <th className={`px-4 py-2 text-left text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                              Date
                            </th>
                            <th className={`px-4 py-2 text-right text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                              Close Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {closes.map((d, i) => (
                            <tr key={d.date} className={`border-b last:border-0 ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                              <td className={`px-4 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                {d.date}
                              </td>
                              <td className={`px-4 py-2 text-sm text-right font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                {d.close.toFixed(4)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Advice */}
                  {advice && (
                    <div className={`p-6 rounded-lg ${advice.bgColor} border-l-4 ${advice.color.replace('text-', 'border-')}`}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <advice.icon className={`w-8 h-8 ${advice.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className={`text-lg font-bold ${advice.color}`}>
                              AI Recommendation: {advice.action}
                            </h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              advice.confidence === 'high' 
                                ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                            }`}>
                              {advice.confidence.toUpperCase()} Confidence
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h5 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                Analysis Summary
                              </h5>
                              <ul className="space-y-1">
                                {advice.reasoning.map((reason, index) => (
                                  <li key={index} className={`text-sm flex items-center space-x-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                Technical Indicators
                              </h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Trend Strength:</span>
                                  <span className={`text-sm font-medium capitalize ${advice.trendStrength === 'strong' ? 'text-green-600' : advice.trendStrength === 'moderate' ? 'text-yellow-600' : 'text-gray-600'}`}>
                                    {advice.trendStrength}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Volatility:</span>
                                  <span className={`text-sm font-medium capitalize ${advice.volatilityLevel === 'high' ? 'text-red-600' : advice.volatilityLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {advice.volatilityLevel}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Model Accuracy:</span>
                                  <span className="text-sm font-medium text-blue-600">{advice.modelAccuracy}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} border border-gray-200 dark:border-gray-600`}>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                              <strong>💡 Trading Tip:</strong> {advice.action === 'BUY' 
                                ? 'Consider entering a long position with proper stop-loss management.' 
                                : advice.action === 'SELL' 
                                ? 'Consider reducing exposure or entering a short position with tight risk controls.'
                                : 'Monitor the market for clearer signals before making significant position changes.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!regression && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Analysis Unavailable
                      </h3>
                      <p className="text-sm mb-4">
                        Unable to perform advanced analysis on this data. This could be due to:
                      </p>
                      <ul className="text-xs space-y-1 text-left max-w-md mx-auto">
                        <li>• Insufficient historical data points</li>
                        <li>• Invalid or missing price data</li>
                        <li>• Data format issues</li>
                        <li>• Regression model failures</li>
                      </ul>
                      <p className="text-xs mt-4 text-gray-400">
                        Try selecting a different currency pair or time period.
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Show message when no analysis has been performed */}
        {!loading && !error && !hasAnalyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-16"
          >
            <Card padding="lg">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Advanced AI Analysis Ready
                </h3>
                <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Select a currency pair and click "Analyze with AI" to get comprehensive analysis using multiple machine learning algorithms including linear, polynomial, exponential, and power regression models.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>🤖 Multi-algorithm analysis</p>
                  <p>📊 Model performance comparison</p>
                  <p>📈 Moving averages & volatility</p>
                  <p>💡 Confidence-based recommendations</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Raw Data - Only show after analysis */}
        {rawData && hasAnalyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <Card padding="lg">
              <details className="group">
                <summary className="cursor-pointer font-semibold flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Show Raw Data Used for Prediction</span>
                </summary>
                <div className="mt-4">
                  <pre className={`text-xs p-4 rounded-lg overflow-x-auto max-h-96 ${
                    theme === "dark" 
                      ? "bg-gray-800 text-gray-300" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {JSON.stringify(rawData, null, 2)}
                  </pre>
                </div>
              </details>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPrediction;