import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function callGemini(message) {
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.5-flash';

  const contents = [
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  try {
    const stream = await genAI.models.generateContentStream({
      model,
      config,
      contents,
    });

    let finalText = '';
    for await (const chunk of stream) {
      finalText += chunk.text || '';
    }

    return finalText || 'No response from Gemini.';
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Gemini failed');
  }
}
