"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Globe,
  Clock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Calculator,
  PlaneTakeoff,
  Target,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useTheme } from "../contexts/ThemeContext.jsx"
import Card from "../components/ui/Card.jsx"
import Button from "../components/ui/Button.jsx"
import { useNavigate } from 'react-router-dom'
import { apiService } from "../services/api.js"

const Dashboard = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [rates, setRates] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [error, setError] = useState(null)
  const [supportedCurrencies, setSupportedCurrencies] = useState([])
  const navigate = useNavigate()

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch supported currencies
      const currencies = await apiService.getSupportedCurrencies()
      setSupportedCurrencies(currencies)
      
      // Fetch exchange rates
      const exchangeRates = await apiService.getDashboardRates('USD')
      const trendingData = apiService.getTrendingCurrencies(exchangeRates, 0.3) // Show currencies with >0.3% movement
      
      setRates({
        USD: exchangeRates,
        trending: trendingData
      })
      
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const refreshRates = () => {
    fetchDashboardData()
  }

  // Calculate portfolio value based on rates (simplified calculation)
  const calculatePortfolioValue = () => {
    if (!rates?.USD) return { value: "$0", change: "0%" }
    
    const totalValue = Object.values(rates.USD).reduce((sum, rate) => sum + rate, 0)
    const avgValue = totalValue / Object.keys(rates.USD).length
    const portfolioValue = avgValue * 1000 // Simulate $1000 base investment
    
    return {
      value: `$${portfolioValue.toFixed(0)}`,
      change: "+5.2%" // This would be calculated from historical data in real app
    }
  }

  // Calculate today's profit (simplified)
  const calculateTodaysProfit = () => {
    if (!rates?.USD) return { value: "$0", change: "0%" }
    
    const profit = Math.random() * 500 + 100 // Random profit between $100-$600
    return {
      value: `$${profit.toFixed(0)}`,
      change: `+${(Math.random() * 20 + 5).toFixed(1)}%`
    }
  }

  const portfolioData = calculatePortfolioValue()
  const profitData = calculateTodaysProfit()

  const quickStats = [
    {
      label: "Portfolio Value",
      value: portfolioData.value,
      change: portfolioData.change,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      trend: "up",
    },
    {
      label: "Active Currencies",
      value: supportedCurrencies.length.toString(),
      change: "+2",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      trend: "up",
    },
    {
      label: "Today's Profit",
      value: profitData.value,
      change: profitData.change,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      trend: "up",
    },
    {
      label: "Alerts Triggered",
      value: "3",
      change: "New",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      trend: "neutral",
    },
  ]

  const quickActions = [
    {
      title: "Currency Converter",
      description: "Convert between currencies with real-time rates",
      icon: Calculator,
      gradient: "from-blue-500 to-purple-500",
      action: "Convert Now",
      link: "/converter",
    },
    {
      title: "Market Analysis",
      description: "View detailed charts and market insights",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      action: "Analyze Markets",
      link: "/market-analysis",
    },
    {
      title: "Travel Planner",
      description: "Plan your international trip budget",
      icon: PlaneTakeoff,
      gradient: "from-green-500 to-blue-500",
      action: "Plan Trip",
      link: "/travel-planner",
    },
    {
      title: "AI Predictions",
      description: "Get AI-powered currency forecasts",
      icon: Target,
      gradient: "from-orange-500 to-red-500",
      action: "View Predictions",
      link: "/ai-prediction",
    },
  ]

  // Generate recent activity based on actual data
  const generateRecentActivity = () => {
    if (!rates?.USD) return []
    
    const activities = []
    const currencies = Object.keys(rates.USD)
    
    // Generate some sample activities
    if (currencies.length > 0) {
      activities.push({
        type: "conversion",
        from: "USD",
        to: currencies[0],
        amount: Math.floor(Math.random() * 1000) + 100,
        time: "2 minutes ago"
      })
    }
    
    if (currencies.length > 1) {
      activities.push({
        type: "alert",
        currency: currencies[1],
        message: "Price target reached",
        time: "15 minutes ago"
      })
    }
    
    activities.push({
      type: "analysis",
      currency: "USD",
      message: "Market analysis completed",
      time: "1 hour ago"
    })
    
    if (currencies.length > 2) {
      activities.push({
        type: "prediction",
        currency: currencies[2],
        message: "New forecast available",
        time: "2 hours ago"
      })
    }
    
    return activities
  }

  const recentActivity = generateRecentActivity()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className={`text-red-600 dark:text-red-400 mb-4`}>{error}</p>
          <Button onClick={fetchDashboardData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
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
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className={`mt-2 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Here's your currency portfolio overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <Button
                onClick={refreshRates}
                variant="outline"
                size="sm"
                icon={<RefreshCw className="w-4 h-4 bg-transparent" />}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {quickStats.map((stat, index) => (
            <Card key={index} hover padding="lg" className="group">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {stat.trend === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                    {stat.trend === "down" && <TrendingDown className="w-4 h-4 mr-1" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} hover padding="lg" className="group cursor-pointer" onClick={() => navigate(action.link)}>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {action.description}
                  </p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                    <span className="text-sm font-medium">{action.action}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Market Overview & Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Currency Rates */}
            <Card padding="lg">
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Live Rates (USD)
              </h3>
              <div className="space-y-3">
                {rates && rates.USD && Object.entries(rates.USD).length > 0 ? (
                  Object.entries(rates.USD).map(([currency, rate]) => (
                    <div
                      key={currency}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{currency}</span>
                        </div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {currency}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {rate.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No exchange rates available
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="lg">
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        {activity.type === "conversion" && <Calculator className="w-4 h-4 text-blue-600" />}
                        {activity.type === "alert" && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                        {activity.type === "analysis" && <BarChart3 className="w-4 h-4 text-purple-600" />}
                        {activity.type === "prediction" && <Target className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {activity.type === "conversion" &&
                            `Converted ${activity.amount} ${activity.from} to ${activity.to}`}
                          {activity.type !== "conversion" && activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trending Currencies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8"
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Trending Currencies
              </h3>
              <div className="text-sm text-gray-500">
                Significant movements vs USD
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rates && rates.trending && rates.trending.length > 0 ? (
                rates.trending.map((currency, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {currency.currency}
                      </span>
                      <div className="flex items-center space-x-1">
                        {currency.direction === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {currency.value.toFixed(4)}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        currency.direction === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {currency.direction === "up" ? "+" : ""}
                      {currency.change}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Prev: {currency.historicalValue?.toFixed(4) || 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <div className="mb-2">
                    <BarChart3 className="w-8 h-8 mx-auto text-gray-400" />
                  </div>
                  <p>No significant price movements detected</p>
                  <p className="text-xs mt-1">Currencies with movements &gt;0.3% will appear here</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
