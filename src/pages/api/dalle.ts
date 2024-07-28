//src/pages/api/dalle.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import fetch from 'node-fetch';
import admin from 'src/libs/firebaseAdmin';

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
    // Verify Firebase token
    await admin.auth().verifyIdToken(token);

    const { prompt, n = 1, size = "1024x1024", model = "dall-e-3" } = req.body;
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ prompt, n, size, model }),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json({ images: data.data });
    } else {
      const errorData = await response.json();
      console.error('Error response from OpenAI:', errorData);
      res.status(response.status).json({ error: 'Failed to generate images', details: errorData });
    }
  } catch (error) {
    console.error('Error verifying token or processing OpenAI request:', error);
    if (isFirebaseAuthError(error) && error.errorInfo.code === 'auth/id-token-expired') {
      res.status(403).json({ error: "Session expired, please log in again." });
    } else {
      res.status(500).json({ error: 'Server error', details: error instanceof Error ? error.message : error });
    }
  }
};
