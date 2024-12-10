//src/pages/api/grok.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';
import admin from 'src/libs/firebaseAdmin';

const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY, // Use Grok API key
  baseURL: 'https://api.x.ai/v1' // Correct property name
});


function isFirebaseAuthError(error: any): error is { errorInfo: { code: string } } {
  return error && typeof error === 'object' && 'errorInfo' in error && 'code' in error.errorInfo;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed if not POST
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  try {
    await admin.auth().verifyIdToken(token);

    const { prompt } = req.body;
    const content = Array.isArray(prompt) ? prompt[0] : prompt;

    const completion = await openai.chat.completions.create({
      model: 'grok-beta', // Replace with the specific model Grok uses
      messages: [{ role: 'user', content }],
      max_tokens: 4096,
    });

    const responseContent = completion?.choices?.[0]?.message?.content?.trim() ?? "No response generated.";
    res.status(200).json({ content: responseContent });
  } catch (error) {
    console.error("Error verifying token or processing Grok request:", error);
    if (isFirebaseAuthError(error) && error.errorInfo.code === 'auth/id-token-expired') {
      res.status(403).json({ error: "Session expired, please log in again." });
    } else {
      res.status(500).json({ error: "Error processing your request." });
    }
  }
};
