import { geminiService } from '../services/geminiService.js';

export const getCurrencyFunFacts = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Both "from" and "to" currency codes are required.'
      });
    }
    if (from === to) {
      return res.status(400).json({
        success: false,
        error: 'From and to currencies must be different.'
      });
    }
    const funFact = await geminiService.getCurrencyFunFacts(from, to);
    res.json({ success: true, data: funFact });
  } catch (error) {
    console.error('Gemini controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate currency fun fact.'
    });
  }
}; 