//src/pages/api/grok-vision.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';
import admin from 'src/libs/firebaseAdmin';

const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

function isFirebaseAuthError(error: any): error is { errorInfo: { code: string } } {
  return typeof error === 'object' && error !== null && 'errorInfo' in error;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Authentication token is required' });
    return;
  }

  try {
    await admin.auth().verifyIdToken(token);

    const { imageUrl, prompt } = req.body;

    // Encode the image to base64
    const base64Image = Buffer.from(imageUrl).toString('base64');

    // Correctly formatted `messages` array
    const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
      {
        role: 'user',
        content: `Image: data:image/jpeg;base64,${base64Image}`,
      },
      {
        role: 'user',
        content: `Prompt: ${prompt}`, // Ensure this is plain text
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'grok-vision-beta',
      messages,
      stream: false,
    });
    console.log('Grok Vision Response:', completion);

    res.status(200).json({ response: completion });
  } catch (error) {
    console.error('Error verifying token or processing Grok request:', error);
    if (isFirebaseAuthError(error) && error.errorInfo.code === 'auth/id-token-expired') {
      res.status(403).json({ error: 'Session expired, please log in again.' });
    } else {
      res.status(500).json({ error: 'Server error', details: error instanceof Error ? error.message : error });
    }
  }
};
