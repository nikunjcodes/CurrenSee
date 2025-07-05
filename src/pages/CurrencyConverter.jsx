import { useState, useEffect } from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { motion } from 'framer-motion';

const CurrencyConverter = () => {
  const { theme } = useTheme();
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);

  useEffect(() => {
    setCurrenciesLoading(true);
    fetch('http://localhost:3001/api/currency/supported')
      .then(res => res.json())
      .then(data => {
        console.log('Supported currencies:', data);
        if (!Array.isArray(data) || data.length === 0) {
          setError('No supported currencies found.');
        } else {
          setCurrencies(data);
        }
        setCurrenciesLoading(false);
      })
      .catch(() => {
        setError('Failed to load supported currencies.');
        setCurrenciesLoading(false);
      });
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/currency/rate?from=${from}&to=${to}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Conversion failed');
        setLoading(false);
        return;
      }
      const rate = parseFloat(data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"]);
      if (!isNaN(rate)) {
        setResult((amount * rate).toFixed(4));
      } else {
        setError('Conversion failed');
      }
    } catch {
      setError('Error fetching rate');
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
      <Card padding="lg" className="w-full max-w-xl shadow-xl dark:shadow-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-3"
        >
          <ArrowRightLeft className="w-8 h-8 text-blue-500" />
          <span className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Currency Converter</span>
        </motion.h2>
        {error && (
          <div className="mb-4 text-center text-red-600 font-medium p-3 bg-red-50 dark:bg-red-900 rounded-lg">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} disabled={currenciesLoading || loading}>
              {currencies.map(c => (
                <option key={c.code} value={c.code} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>To</label>
            <select value={to} onChange={e => setTo(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} disabled={currenciesLoading || loading}>
              {currencies.map(c => (
                <option key={c.code} value={c.code} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Amount</label>
          <input type="number" value={amount} min="0" onChange={e => setAmount(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} disabled={currenciesLoading || loading} />
        </div>
        <Button onClick={handleConvert} disabled={loading || currenciesLoading || currencies.length === 0} className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
          {loading ? (
            <span className="flex items-center justify-center"><RefreshCw className="animate-spin w-5 h-5 mr-2" /> Converting...</span>
          ) : (
            'Convert'
          )}
        </Button>
        {result && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl text-center shadow-md"
          >
            <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Result:</p>
            <p className={`text-4xl font-extrabold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {amount} {from} = <span className="text-blue-600 dark:text-blue-400">{result} {to}</span>
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default CurrencyConverter; 