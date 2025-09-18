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
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
      throw new Error("No API configuration found. Set VITE_WORKER_URL or VITE_GEMINI_API_KEY");
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error:", response.status, errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0) {
      const rawResponse = result.candidates[0].content.parts[0].text;
      try {
        // Attempt to clean up the response by removing markdown backticks if they exist
        const cleanedResponse = rawResponse.replace(/```json/g, "").replace(/```/g, "");
        return JSON.parse(cleanedResponse);
      } catch (e) {
        console.error("Failed to parse JSON response from AI:", rawResponse);
        throw new Error("Invalid JSON response from AI.");
      }
    } else {
      console.error("No candidates returned from API:", result);
      throw new Error("No content received from AI.");
    }
  } catch (error) {
    console.error("Error in analyzeText:", error);
    return {
      summary: "Error: Could not analyze the text. See console for details.",
      keywords: [],
      sentiment: "unknown",
    };
  }
}
