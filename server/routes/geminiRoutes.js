import express from 'express';
import { getCurrencyFunFacts } from '../controllers/geminiController.js';

const router = express.Router();

// GET /api/gemini/fun-facts?from=USD&to=EUR
router.get('/fun-facts', getCurrencyFunFacts);

export default router; 