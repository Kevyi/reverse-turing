import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function callGroq(message) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
  });

  return completion.choices[0]?.message?.content || 'No response from Groq.';
}