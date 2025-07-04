"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Download, Settings, TrendingUp } from "lucide-react"
import Sidebar from "../components/ui/Sidebar.jsx"
import { useTheme } from "../contexts/ThemeContext.jsx"

const CurrencyVisualizer = () => {
  const { theme } = useTheme()
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [timeRange, setTimeRange] = useState("1Y")
  const [chartType, setChartType] = useState("line")
  const [chartData, setChartData] = useState([])
  const [favorites, setFavorites] = useState(["USD", "EUR", "GBP"])
  const [isLoading, setIsLoading] = useState(false)

  const currencies = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸", change: 0.25 },
    { code: "EUR", name: "Euro", flag: "🇪🇺", change: -0.15 },
    { code: "GBP", name: "British Pound", flag: "🇬🇧", change: 0.45 },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", change: -0.82 },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", change: 0.18 },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", change: -0.33 },
    { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", change: 0.12 },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", change: -0.05 },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳", change: -0.67 },
    { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", change: -1.23 },
  ]

  const timeRanges = [
    { value: "1D", label: "1 Day" },
    { value: "1W", label: "1 Week" },
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "5Y", label: "5 Years" },
  ]

  useEffect(() => {
    generateChartData()
  }, [selectedCurrency, timeRange])

  const generateChartData = () => {
    setIsLoading(true)

    setTimeout(() => {
      const periods = {
        "1D": { days: 1, interval: "hour" },
        "1W": { days: 7, interval: "day" },
        "1M": { days: 30, interval: "day" },
        "3M": { days: 90, interval: "day" },
        "6M": { days: 180, interval: "day" },
        "1Y": { days: 365, interval: "day" },
        "5Y": { days: 1825, interval: "week" },
      }

      const { days } = periods[timeRange]
      const baseValue = 1.0
      const data = []

      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        const trend = 0.0001 * (days - i) // Slight upward trend
        const volatility = 0.02 * (Math.random() - 0.5) // Random volatility
        const value = baseValue + trend + volatility

        data.push({
          date: date.toISOString().split("T")[0],
          value: value,
          displayDate: date.toLocaleDateString(),
          volume: Math.random() * 1000000 + 500000,
          high: value + Math.random() * 0.01,
          low: value - Math.random() * 0.01,
        })
      }

      setChartData(data)
      setIsLoading(false)
    }, 500)
  }

  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode)
  }

  const handleToggleFavorite = (currencyCode) => {
    setFavorites((prev) =>
      prev.includes(currencyCode) ? prev.filter((code) => code !== currencyCode) : [...prev, currencyCode],
    )
  }

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency)
  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 1.0
  const previousValue = chartData.length > 1 ? chartData[chartData.length - 2].value : 1.0
  const change = currentValue - previousValue
  const changePercent = (change / previousValue) * 100

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={handleCurrencySelect}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{currentCurrency?.flag}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCurrency}/USD</h1>
                <p className="text-gray-500 dark:text-gray-400">{currentCurrency?.name} to US Dollar</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">${currentValue.toFixed(4)}</div>
                <div className={`flex items-center space-x-1 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  <TrendingUp className={`w-4 h-4 ${change < 0 ? "rotate-180" : ""}`} />
                  <span className="font-medium">
                    {change >= 0 ? "+" : ""}
                    {change.toFixed(4)} ({changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
                <div className="flex space-x-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setTimeRange(range.value)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        timeRange === range.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chart Type:</span>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              >
                <option value="line">Line Chart</option>
                <option value="area">Area Chart</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 p-6 bg-white dark:bg-gray-900">
          <div className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#E5E7EB"} />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis
                      tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
                      domain={["dataMin - 0.001", "dataMax + 0.001"]}
                      tickFormatter={(value) => `$${value.toFixed(4)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                        border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                        borderRadius: "8px",
                        color: theme === "dark" ? "#FFFFFF" : "#1F2937",
                      }}
                      formatter={(value) => [`$${value.toFixed(4)}`, "Exchange Rate"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#3B82F6" }}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#E5E7EB"} />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis
                      tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
                      domain={["dataMin - 0.001", "dataMax + 0.001"]}
                      tickFormatter={(value) => `$${value.toFixed(4)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                        border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                        borderRadius: "8px",
                        color: theme === "dark" ? "#FFFFFF" : "#1F2937",
                      }}
                      formatter={(value) => [`$${value.toFixed(4)}`, "Exchange Rate"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#colorBlue)" strokeWidth={2} />
                    <defs>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrencyVisualizer
