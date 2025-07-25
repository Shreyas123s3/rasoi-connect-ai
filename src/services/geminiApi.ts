
const GEMINI_API_KEY = "AIzaSyDpOZ-kclqMvnXBz7PIryEhKIZz3SuIZoM";

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export async function callGeminiApi(userMessage: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are GemBot, an AI procurement assistant for RasoiLink - a platform helping Indian food vendors find suppliers and save money. 

Context: RasoiLink connects food vendors with trusted suppliers, enables bulk ordering, provides market insights, and helps vendors reduce procurement costs by 30%.

User's question: ${userMessage}

Please provide helpful, relevant advice about:
- Finding suppliers and comparing prices
- Suggesting seasonal alternatives and substitutions
- Providing storage and procurement tips
- Market trends and opportunities
- Bulk ordering benefits
- Cost-saving strategies

Keep responses conversational, practical, and focused on helping food vendors in India.`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("No response received from AI");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again or check your internet connection.";
  }
}
