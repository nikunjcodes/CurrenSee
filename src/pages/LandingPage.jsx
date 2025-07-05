"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Calculator,
  PlaneTakeoff,
  BarChart3,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock,
  LineChart,
  Target,
  Sparkles,
} from "lucide-react"
import { useTheme } from "../contexts/ThemeContext.jsx"
import Button from "../components/ui/Button.jsx"
import Card from "../components/ui/Card.jsx"

const LandingPage = () => {
  const { theme } = useTheme()

  const features = [
    {
      icon: Calculator,
      title: "Real-time Conversion",
      description: "Convert between 150+ currencies with live exchange rates updated every minute.",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: BarChart3,
      title: "Market Analysis",
      description: "Advanced charts and trend analysis to help you make informed decisions.",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: PlaneTakeoff,
      title: "Travel Planning",
      description: "Smart budget planning tools for your international trips and expenses.",
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: Shield,
      title: "Bank-grade Security",
      description: "Your financial data is protected with enterprise-level encryption.",
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant conversions and real-time updates for optimal trading timing.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Supporting currencies from every corner of the world with 99.9% uptime.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
    },
  ]

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users", color: "text-blue-500" },
    { icon: Globe, value: "150+", label: "Currencies", color: "text-purple-500" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-green-500" },
    { icon: Star, value: "4.9", label: "Rating", color: "text-yellow-500" },
  ]

  const useCases = [
    {
      title: "International Travelers",
      description: "Plan your budget, track expenses, and convert currencies on the go.",
      icon: PlaneTakeoff,
      benefits: ["Trip budget planning", "Expense tracking", "Offline access"],
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: "Business Professionals",
      description: "Make informed decisions with real-time rates and market analysis.",
      icon: BarChart3,
      benefits: ["Real-time alerts", "Market trends", "Historical data"],
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Currency Traders",
      description: "Advanced tools for professional currency trading and analysis.",
      icon: TrendingUp,
      benefits: ["Live rates", "Technical analysis", "Risk management"],
      gradient: "from-green-500 to-blue-600",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trusted by 50,000+ users worldwide
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                CurrenSee
              </span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl text-gray-700 dark:text-gray-200 font-normal">
                the future of currency management
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              The most advanced currency platform with real-time rates, AI-powered predictions, and smart planning tools
              for travelers, traders, and businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="xl"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Bank-grade security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Real-time data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>150+ currencies</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
              <Card
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50"
                padding="lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-blue-500" />
                      <span>Convert</span>
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">1,000</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">USD</div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-purple-500" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">847.30</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">EUR</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <LineChart className="w-5 h-5 text-purple-500" />
                      <span>Analyze</span>
                    </h3>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl p-4">
                      <div className="h-16 flex items-end justify-between space-x-1">
                        {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm flex-1"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <span>Predict</span>
                    </h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/50 dark:to-blue-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <TrendingUp className="w-8 h-8 text-green-500" />
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">+2.4%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Next 7 days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              Everything you need for currency management
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
            >
              From real-time conversions to AI-powered predictions, CurrenSee provides all the tools you need to make
              informed currency decisions.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover padding="lg" className="h-full group">
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              Perfect for every use case
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card padding="lg" className="h-full group hover:shadow-xl transition-all duration-300">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${useCase.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{useCase.title}</h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to master currency management?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who trust CurrenSee for their financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  variant="secondary"
                  size="xl"
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
