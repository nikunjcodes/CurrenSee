import express from 'express';
import { getCurrencyFunFacts } from '../controllers/geminiController.js';

const router = express.Router();

router.get('/fun-facts', getCurrencyFunFacts);

export default router; 