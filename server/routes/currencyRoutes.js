import express from 'express';
import { fetchExchangeRate, fetchHistoricalRates, getSupportedCurrencies, testAPI } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/test', testAPI);
router.get('/rate', fetchExchangeRate);
router.get('/history', fetchHistoricalRates);
router.get('/supported', getSupportedCurrencies);

export default router; 