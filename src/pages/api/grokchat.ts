//src/pages/api/grokchat.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { prompt } = req.body;

  try {
    const content = Array.isArray(prompt) ? prompt[0] : prompt;

    const stream = await openai.chat.completions.create({
      model: 'grok-beta', // Use this model for chat
      messages: [{ role: 'user', content }],
      stream: true, // Enable streaming
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify(content)}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Error processing Grok streaming request:', error);

    if (error instanceof Error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    } else {
      res.status(500).json({ error: 'Server error', details: 'An unknown error occurred.' });
    }
  }
};
