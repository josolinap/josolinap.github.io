export async function analyzeText(text) {
  // Try worker URL first, fallback to direct API for development
  const workerUrl = import.meta.env.VITE_WORKER_URL;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    const prompt = `Analyze the following text and return a structured JSON object with the following three properties:
- "summary": A concise summary of the text.
- "keywords": An array of the most important keywords.
- "sentiment": The overall sentiment of the text (can be "positive", "negative", or "neutral").

Do not include any markdown formatting (like \`\`\`json) in the output. The output should be only the raw JSON object.

Text to analyze:
---
${text}
---`;

    let response;

    if (workerUrl) {
      // Use Cloudflare Worker (production)
      console.log('Using Cloudflare Worker for AI request');
      response = await fetch(workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
    } else if (apiKey) {
      // Fallback to direct API (development)
      console.log('Using direct Gemini API (may have CORS issues)');
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
    } else {
      console.warn('No API configuration found - using fallback response');
      return getFallbackAnalysis(text);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `API request failed with status ${response.status}`;
      let shouldFallback = false;

      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error) {
          errorMessage = errorJson.error;
        }
        if (errorJson.details) {
          console.error("API Error details:", errorJson.details);
        }

        // If the worker indicates it's a Gemini API error, determine if we should fallback
        if (errorJson.error && errorJson.error.includes('Gemini API error')) {
          const status = parseInt(errorJson.error.split(' ')[4]); // Extract status from "Gemini API error: 500 Internal Server Error"
          if (status === 429 || status === 403) {
            shouldFallback = true;
          }
        }
      } catch (e) {
        // Not JSON, use raw error body
        errorMessage += `: ${errorBody}`;
      }

      console.error("API Error:", response.status, errorMessage);

      // If it's a CORS or network error, or rate limit/quota exceeded, provide fallback
      if (response.status === 0 || response.status === 403 || response.status === 429 || shouldFallback) {
        console.log('API error detected, using fallback analysis');
        return getFallbackAnalysis(text);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('API Response:', result);

    if (result.candidates && result.candidates.length > 0) {
      const rawResponse = result.candidates[0].content.parts[0].text;
      try {
        // Attempt to clean up the response by removing markdown backticks if they exist
        const cleanedResponse = rawResponse.replace(/```json/g, "").replace(/```/g, "");
        const parsed = JSON.parse(cleanedResponse);
        console.log('Parsed AI response:', parsed);
        return parsed;
      } catch (e) {
        console.error("Failed to parse JSON response from AI:", rawResponse);
        console.log('Using fallback analysis due to parse error');
        return getFallbackAnalysis(text);
      }
    } else {
      console.error("No candidates returned from API:", result);
      console.log('Using fallback analysis due to no candidates');
      return getFallbackAnalysis(text);
    }
  } catch (error) {
    console.error("Error in analyzeText:", error);
    console.log('Using fallback analysis due to exception');
    return getFallbackAnalysis(text);
  }
}

// Fallback analysis when API is not available
function getFallbackAnalysis(text) {
  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'disappointed', 'horrible', 'worst'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  let sentiment = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  if (negativeCount > positiveCount) sentiment = 'negative';

  // Extract basic keywords
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const keywords = [...new Set(words)].slice(0, 5);

  return {
    summary: `Analysis of: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
    keywords: keywords,
    sentiment: sentiment,
    note: "This is a fallback analysis. For full AI capabilities, set up a Cloudflare Worker."
  };
}
