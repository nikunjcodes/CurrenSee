import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Utensils, 
  Car, 
  Zap, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  MapPin,
  Globe,
  Building
} from 'lucide-react';
import Card from './ui/Card.jsx';

// Category Card Component
export const CategoryCard = ({ title, icon: Icon, items, currency, exchangeRate, sourceCurrency, sourceSymbol, destinationSymbol }) => {
  const total = items.reduce((sum, item) => {
    const value = Number(item.usd?.avg || item.avg || 0);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  const convertedTotal = exchangeRate ? total * exchangeRate : total;
  const average = items.length > 0 ? total / items.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full" padding="lg" hover>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 mr-3">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
          {items.map((item, index) => {
            const avgValue = Number(item.usd?.avg || item.avg || 0);
            const minValue = Number(item.usd?.min || 0);
            const maxValue = Number(item.usd?.max || 0);
            
            return (
              <div key={item.good_id || index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex-1 pr-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.item_name}</span>
                  {minValue > 0 && maxValue > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Range: {destinationSymbol}{minValue.toFixed(2)} - {destinationSymbol}{maxValue.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {destinationSymbol}{avgValue.toFixed(2)}
                  </span>
                  {exchangeRate && sourceSymbol && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ≈ {sourceSymbol}{(avgValue * exchangeRate).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average:</span>
              <div className="text-right">
                <div className="font-semibold text-primary-600 dark:text-primary-400">
                  {destinationSymbol}{average.toFixed(2)}
                </div>
                {exchangeRate && sourceSymbol && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ≈ {sourceSymbol}{(average * exchangeRate).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total:</span>
              <div className="text-right">
                <div className="font-bold text-lg text-primary-600 dark:text-primary-400">
                  {destinationSymbol}{total.toFixed(2)}
                </div>
                {exchangeRate && sourceSymbol && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ≈ {sourceSymbol}{convertedTotal.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Exchange Rate Component
export const ExchangeRateCard = ({ sourceCountry, destinationCountry, exchangeRate, sourceCurrency, destinationCurrency, sourceSymbol, destinationSymbol }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900" padding="lg">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Exchange Rate</h3>
        </div>
        
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">From</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{sourceCountry}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{sourceSymbol} ({sourceCurrency})</div>
            </div>
            
            <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">To</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{destinationCountry}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{destinationSymbol} ({destinationCurrency})</div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              1 {sourceSymbol} = {exchangeRate?.toFixed(4) || 'N/A'} {destinationSymbol}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Suggestion Input Component
export const SuggestionInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  suggestions, 
  onSuggestionClick,
  icon: Icon,
  loading = false 
}) => {
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Convert label to field name
  const getFieldName = (label) => {
    if (label === 'Source Country') return 'sourceCountry';
    if (label === 'Destination Country') return 'destinationCountry';
    if (label === 'Destination City') return 'destinationCity';
    return label.toLowerCase().replace(/\s+/g, '');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type="text"
          name={getFieldName(label)}
          value={value}
          onChange={onChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 ${Icon ? 'pl-10' : ''}`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onSuggestionClick(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-150"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 