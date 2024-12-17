// src/pages/api/grok-image.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import admin from 'src/libs/firebaseAdmin';
import OpenAI from 'openai';

// Initialize OpenAI SDK for Grok
const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY, // Use xAI API key
  baseURL: "https://api.x.ai/v1",  // Set Grok's base URL
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  try {
    await admin.auth().verifyIdToken(token);

    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string.' });
    }

    console.log('Received Prompt:', prompt);

    // Make API call to Grok via OpenAI SDK
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      model: 'grok-vision-beta', // Specify the image generation model
    });


    console.log('Grok API Response:', response.data);

    if (response.data && response.data.length > 0) {
      return res.status(200).json({ response: { images: [response.data[0].url] } });
    } else {
      throw new Error('No image URL returned from the API.');
    }
  } catch (error) {
    // Type guard to check if 'error' is an instance of Error
    if (error instanceof Error) {
      console.error('Error Details:', error.message);
      return res.status(500).json({
        error: 'Server error',
        details: error.message,
      });
    }

    console.error('Unexpected Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
