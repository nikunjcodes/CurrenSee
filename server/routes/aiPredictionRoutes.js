import express from 'express';
import { getPredictionData, getPredictionAnalysis } from '../controllers/aiPredictionController.js';

const router = express.Router();

router.get('/data', getPredictionData);
router.get('/analysis', getPredictionAnalysis);

export default router; 