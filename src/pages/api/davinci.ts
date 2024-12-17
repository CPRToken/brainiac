import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { prompt } = req.body;
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
    });


    res.status(200).json({ content: response.choices[0].text.trim() });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
