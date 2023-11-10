import { NextApiRequest, NextApiResponse } from 'next/types';
import fetch from 'node-fetch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { prompt, n = 1, size = "1024x1024", model = "dall-e-3" } = req.body;

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          n: n,
          size: size,
          model: model
        }),
      });

      // You should check if the response was ok before assuming data.data is valid
      if (response.ok) {
        const data = await response.json();
        res.status(200).json({ images: data.data });
      } else {
        // If response was not ok, you handle it here
        const errorData = await response.json();  // Assume that the API returns JSON even on error
        console.error('Error response from OpenAI:', errorData);
        res.status(response.status).json({ error: 'Failed to generate images', details: errorData });
      }
    } catch (error) {
      console.error('Error in making the API request:', error);
      res.status(500).json({ error: 'Error in making the API request', details: error instanceof Error ? error.message : error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
};
