"use client"
import { Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useAuth } from "./contexts/AuthContext.jsx"
import { useTheme } from "./contexts/ThemeContext.jsx"

// Components
import Navbar from "./components/Navbar.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import OfflineBanner from "./components/OfflineBanner.jsx"
import CurrencyConverter from "./pages/CurrencyConverter.jsx"
import MarketAnalysis from "./pages/MarketAnalysis.jsx"
import AIPrediction from "./pages/AIPrediction.jsx"

function App() {
  const { loading } = useAuth()
  const { theme } = useTheme()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      <OfflineBanner />
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/converter"
            element={
              <ProtectedRoute>
                <CurrencyConverter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market-analysis"
            element={
              <ProtectedRoute>
                <MarketAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-prediction"
            element={
              <ProtectedRoute>
                <AIPrediction />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
