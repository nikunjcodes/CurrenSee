import { useState, useEffect } from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { motion } from 'framer-motion';
import { BarChart3, RefreshCw, Maximize2, Minimize2, CalendarClock } from 'lucide-react';

const MarketAnalysis = () => {
  const { theme } = useTheme();
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState('INR');
  const [to, setTo] = useState('USD');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const [highLow, setHighLow] = useState({ high: null, low: null });
  const [lastRefreshed, setLastRefreshed] = useState(null);

  useEffect(() => {
    setCurrenciesLoading(true);
    fetch('http://localhost:3001/api/currency/supported')
      .then(res => res.json())
      .then(data => {
        setCurrencies(data);
        setCurrenciesLoading(false);
      })
      .catch(() => {
        setError('Failed to load supported currencies.');
        setCurrenciesLoading(false);
      });
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setData([]);
    setError(null);
    setHighLow({ high: null, low: null });
    setLastRefreshed(null);
    try {
      const res = await fetch(`http://localhost:3001/api/currency/history?from=${from}&to=${to}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to fetch data');
        setLoading(false);
        return;
      }
      const series = json['Time Series FX (Daily)'] || {};
      const metaData = json['Meta Data'] || {};
      const chartData = Object.entries(series).map(([date, values]) => ({
        date,
        close: parseFloat(values['4. close'])
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      let currentHigh = -Infinity;
      let currentLow = Infinity;

      chartData.forEach(item => {
        if (item.close > currentHigh) currentHigh = item.close;
        if (item.close < currentLow) currentLow = item.close;
      });

      setData(chartData);
      setHighLow({ high: currentHigh, low: currentLow });
      setLastRefreshed(metaData['5. Last Refreshed']);

      if (chartData.length === 0) setError('No data to display.');
    } catch {
      setError('Error fetching data');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
    >
      <Card padding="lg" className="w-full max-w-4xl shadow-xl dark:shadow-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-3"
        >
          <BarChart3 className="w-8 h-8 text-purple-500" />
          <span className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Market Analysis</span>
        </motion.h2>
        {error && (
          <div className="mb-4 text-center text-red-600 font-medium p-3 bg-red-50 dark:bg-red-900 rounded-lg">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>From Symbol</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} disabled={currenciesLoading || loading}>
              {currencies.map(c => (
                <option key={c.code} value={c.code} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>To Symbol</label>
            <select value={to} onChange={e => setTo(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} disabled={currenciesLoading || loading}>
              {currencies.map(c => (
                <option key={c.code} value={c.code} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={fetchHistory} disabled={loading || currenciesLoading || currencies.length === 0} className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 mb-6">
          {loading ? (
            <span className="flex items-center justify-center"><RefreshCw className="animate-spin w-5 h-5 mr-2" /> Loading Chart...</span>
          ) : (
            'Show Graph'
          )}
        </Button>

        {lastRefreshed && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-sm mb-4 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            <p className="flex items-center justify-center space-x-1">
              <CalendarClock className="w-4 h-4" />
              <span>Last Refreshed: {new Date(lastRefreshed).toLocaleDateString()}</span>
            </p>
          </motion.div>
        )}

        <div className="w-full h-[400px] mb-6">
          {data.length > 0 && !error ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${theme === "dark" ? "#4B5563" : "#D1D5DB"}`} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: theme === "dark" ? "#D1D5DB" : "#4B5563" }} minTickGap={20} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: theme === "dark" ? "#D1D5DB" : "#4B5563" }} />
                <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF", borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB", color: theme === "dark" ? "#E5E7EB" : "#1F2937" }} itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#1F2937" }} />
                <Line type="monotone" dataKey="close" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (data.length === 0 && !loading && !error) ? (
            <div className={`text-center py-10 rounded-lg ${theme === "dark" ? "text-gray-400 bg-gray-800" : "text-gray-600 bg-gray-100"}`}>Select currencies and click 'Show Graph' to view historical data.</div>
          ) : (
            <div className="text-center text-gray-500">{loading ? 'Loading...' : 'No data to display.'}</div>
          )}
        </div>

        {highLow.high !== null && highLow.low !== null && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
          >
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg flex items-center space-x-3 shadow-sm">
              <Maximize2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>All-time High (from available data)</p>
                <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{highLow.high.toFixed(4)}</p>
              </div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg flex items-center space-x-3 shadow-sm">
              <Minimize2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>All-time Low (from available data)</p>
                <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{highLow.low.toFixed(4)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default MarketAnalysis; 