import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiService = {
  async getCurrencyFunFacts(fromCurrency, toCurrency) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Generate a fun fact about the relationship between ${fromCurrency} and ${toCurrency} currencies.
        Return the response in this exact JSON format:

        {
          "title": "A catchy title about the currencies",
          "fact": "An interesting fact about the relationship between these currencies",
          "historical_note": "A brief historical context or interesting historical fact",
          "emoji": "A relevant emoji for the currencies"
        }

        Keep the fact concise, interesting, and educational. Focus on economic, historical, or cultural aspects.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.title && parsed.fact && parsed.historical_note && parsed.emoji) {
            return parsed;
          }
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
      }

      return {
        title: `Fun Fact: ${fromCurrency} & ${toCurrency}`,
        fact: text || `Interesting relationship between ${fromCurrency} and ${toCurrency} currencies`,
        historical_note: "Currency exchange has fascinating historical roots.",
        emoji: "💱"
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        title: `Currency Insight: ${fromCurrency} & ${toCurrency}`,
        fact: `The exchange rate between ${fromCurrency} and ${toCurrency} reflects global economic dynamics.`,
        historical_note: "Currency exchange rates have evolved significantly over time.",
        emoji: "💱"
      };
    }
  }
}; 