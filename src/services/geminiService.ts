
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (query: string, apiKey: string): Promise<string> => {
  console.log('Calling Gemini API with query:', query);
  console.log('Using API key:', apiKey ? 'Present' : 'Missing');

  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const prompt = `You are GemBot, an AI procurement assistant for RasoiLink, a platform that connects vendors, suppliers, and buyers in India's food and agriculture supply chain. 

Context: You help with finding suppliers, market prices, procurement tips, and location-based recommendations across India.

User Query: ${query}

Please provide a helpful, detailed response that includes:
- Specific supplier recommendations when possible
- Current market insights or price ranges
- Location-specific information if relevant
- Practical procurement advice
- Use Indian Rupee (₹) for all prices
- Format your response with emojis and structured information for better readability

Response:`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API request failed: ${response.status} - ${errorData}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('Gemini API response data:', data);

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Generated response:', generatedText);
      return generatedText;
    } else {
      console.error('No valid response from Gemini API:', data);
      throw new Error('No valid response received from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
