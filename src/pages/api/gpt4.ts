import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      const content = Array.isArray(prompt) ? prompt[0] : prompt;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content }],
        max_tokens: 3000,
      });

      const responseContent = completion?.choices?.[0]?.message?.content?.trim() ?? "No response generated.";
      res.status(200).json({ content: responseContent });
    } catch (error) {
      console.error("Error during OpenAI API call:", error);
      res.status(500).json({ error: "Error processing your request." });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
