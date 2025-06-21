import { callGroq } from '@/lib/llms/groq';
import { callGemini } from '@/lib/llms/gemini';

export async function POST(req) {
  //Get message from request body
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { message } = body;

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Run both calls in parallel
    const [groqResponse, geminiResponse] = await Promise.all([
      callGroq(message),
      callGemini(message),
    ]);

    return new Response(
      JSON.stringify({
        groq: groqResponse,
        gemini: geminiResponse,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error calling models:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get responses from models' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
