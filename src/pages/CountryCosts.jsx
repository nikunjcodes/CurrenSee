"use client"

import { useState } from "react"
import { useTheme } from "../contexts/ThemeContext.jsx"

const CountryCosts = () => {
  const { theme } = useTheme();
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [costData, setCostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { name: 'United States', flag: '🇺🇸', capital: 'Washington D.C.', currency: 'USD' },
    { name: 'United Kingdom', flag: '🇬🇧', capital: 'London', currency: 'GBP' },
    { name:\
