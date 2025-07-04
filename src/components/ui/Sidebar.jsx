"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Star, TrendingUp, TrendingDown } from "lucide-react"

const Sidebar = ({ onCurrencySelect, selectedCurrency, currencies, favorites = [], onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const displayCurrencies = showFavorites
    ? filteredCurrencies.filter((currency) => favorites.includes(currency.code))
    : filteredCurrencies

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Currencies</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search currencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex mt-4 space-x-2">
          <button
            onClick={() => setShowFavorites(false)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              !showFavorites
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              showFavorites
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {/* Currency List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {displayCurrencies.map((currency) => (
            <motion.div
              key={currency.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                selectedCurrency === currency.code
                  ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent"
              }`}
              onClick={() => onCurrencySelect(currency.code)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{currency.flag}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{currency.code}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{currency.name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currency.change && (
                  <div
                    className={`flex items-center space-x-1 ${currency.change > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {currency.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-xs font-medium">{Math.abs(currency.change).toFixed(2)}%</span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(currency.code)
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorites.includes(currency.code) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
