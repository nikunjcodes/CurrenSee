import { useState, useEffect } from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { RefreshCw, ArrowRightLeft, Lightbulb, History, Sparkles } from 'lucide-react';
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
  const [funFact, setFunFact] = useState(null);
  const [funFactLoading, setFunFactLoading] = useState(false);

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

  // Fetch fun fact when currencies change
  useEffect(() => {
    if (from && to && from !== to) {
      fetchFunFact();
    }
  }, [from, to]);

  const fetchFunFact = async () => {
    setFunFactLoading(true);
    setFunFact(null);
    try {
      const response = await fetch(`http://localhost:3001/api/gemini/fun-facts?from=${from}&to=${to}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setFunFact(data.data);
      } else {
        console.error('Failed to fetch fun fact:', data.error);
        // Don't set error for fun fact failure as it's not critical
      }
    } catch (error) {
      console.error('Failed to fetch fun fact:', error);
      // Don't set error for fun fact failure as it's not critical
    } finally {
      setFunFactLoading(false);
    }
  };

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
      className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Currency Converter Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card padding="lg" className="h-fit shadow-xl dark:shadow-none">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
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

          {/* Fun Facts Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card padding="lg" className="h-fit shadow-xl dark:shadow-none">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Currency Fun Facts
                </h2>
              </div>

              {funFactLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Lightbulb className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Discovering interesting facts...
                  </p>
                </div>
              ) : funFact ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Main Fact */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl p-6 border-l-4 border-yellow-400">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{funFact.emoji}</div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {funFact.title}
                        </h3>
                        <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {funFact.fact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Historical Note */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-6 border-l-4 border-blue-400">
                    <div className="flex items-start space-x-3">
                      <History className="w-6 h-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Historical Context
                        </h4>
                        <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {funFact.historical_note}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Currency Pair Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl p-6 border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Current Pair
                        </h4>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                          {from} to {to} conversion
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {from}/{to}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Select different currencies to discover fun facts!
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrencyConverter; 