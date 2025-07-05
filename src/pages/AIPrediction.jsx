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
  ArrowRight
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { apiService } from "../services/api.js";
import { SimpleLinearRegression } from "ml-regression";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const PERIODS = [7, 30, 90];
const DEFAULT_FROM = "USD";
const DEFAULT_TO = "EUR";

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

function runRegression(data) {
  if (!Array.isArray(data) || data.length < 2) {
    return null;
  }
  
  try {
    const x = data.map((_, i) => i);
    const y = data.map(d => d.close);
    
    // Validate that all y values are valid numbers
    if (y.some(val => isNaN(val) || !isFinite(val))) {
      throw new Error('Invalid data points detected');
    }
    
    const regression = new SimpleLinearRegression(x, y);
    const nextDay = x.length;
    const predicted = regression.predict(nextDay);
    
    return {
      regression,
      predicted,
      slope: regression.slope,
      intercept: regression.intercept
    };
  } catch (error) {
    console.error('Regression error:', error);
    return null;
  }
}

function getAdvice(slope) {
  if (slope > 0.01) return { 
    text: "Strong upward trend detected. Consider buying or holding.", 
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
    icon: TrendingUp,
    action: "BUY"
  };
  if (slope < -0.01) return { 
    text: "Strong downward trend detected. Consider selling or holding.", 
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
    icon: TrendingDown,
    action: "SELL"
  };
  return { 
    text: "Stable trend. Hold or wait for more data.", 
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    icon: BarChart3,
    action: "HOLD"
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
        if (closes.length < 2) {
          throw new Error(`Insufficient data for ${period}-day analysis. Need at least 2 data points.`);
        }
        const regression = runRegression(closes);
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
                AI Currency Prediction 🤖
              </h1>
              <p className={`mt-2 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Machine learning-powered trend analysis and trading advice
              </p>
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
              const advice = regression ? getAdvice(regression.slope) : null;
              
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {regression.predicted.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-500">Predicted Next Day</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className={`text-2xl font-bold ${advice.color}`}>
                          {regression.slope > 0 ? '+' : ''}{regression.slope.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-500">Trend Slope</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <advice.icon className={`w-6 h-6 ${advice.color}`} />
                          <span className={`font-medium ${advice.color}`}>
                            {advice.action}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">Recommendation</div>
                      </div>
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
                    <div className={`p-4 rounded-lg ${advice.bgColor}`}>
                      <div className="flex items-start space-x-3">
                        <advice.icon className={`w-5 h-5 mt-0.5 ${advice.color}`} />
                        <div>
                          <h4 className={`font-medium ${advice.color}`}>
                            AI Recommendation
                          </h4>
                          <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {advice.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!regression && (
                    <div className="text-center py-4 text-gray-500">
                      <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Not enough data for prediction</p>
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
                  Ready to Analyze?
                </h3>
                <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Select a currency pair above and click "Analyze with AI" to get machine learning-powered predictions and trading advice.
                </p>
                <div className="text-xs text-gray-500">
                  <p>💡 Popular pairs: USD/EUR, EUR/GBP, USD/JPY</p>
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