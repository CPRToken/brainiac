//src/pages/api/chatgpt.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    // Extract the first element of the prompt array
    const content = Array.isArray(prompt) ? prompt[0] : prompt;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content }],
      max_tokens: 1000,
    });

    const responseContent = completion?.choices?.[0]?.message?.content?.trim() ?? "No response generated.";

    res.status(200).json({ content: responseContent });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

