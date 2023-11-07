import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';
import fs from 'fs';

interface OpenAIWithImage extends OpenAI {
  createImage: (options: {
    prompt: string;
    n: number;
    size: string;
  }) => Promise<any>; // Replace 'any' with the actual expected response type
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) as OpenAIWithImage;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await openai.createImage({
        prompt: req.body.prompt, // Make sure to use the prompt from the request body
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = response.data.data[0].url;

      // Respond with the image URL
      res.status(200).json({ imageUrl });
    } catch (error) {
      if (error.response) {
        // Respond with the error from the API
        res.status(error.response.status).json(error.response.data);
      } else {
        // Respond with a generic server error
        res.status(500).json({ message: error.message });
      }
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
