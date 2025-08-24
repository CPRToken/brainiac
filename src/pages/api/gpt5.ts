// /src/pages/api/gpt5.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import OpenAI from 'openai';
import admin from 'src/libs/firebaseAdmin';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function isFirebaseAuthError(error: any): error is { errorInfo: { code: string } } {
  return error && typeof error === 'object' && 'errorInfo' in error && 'code' in error.errorInfo;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token is required' });

  try {
    await admin.auth().verifyIdToken(token);

    const { prompt, max_tokens, max_completion_tokens } = req.body || {};

    console.log("REQ BODY >>>", req.body);

    const content = Array.isArray(prompt) ? prompt[0] : prompt;
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // map old param name to GPT-5’s
    const maxOut = Number(max_completion_tokens ?? max_tokens ?? 1024) || 1024;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content }],
      max_completion_tokens: maxOut, // <-- GPT-5 requires this name
      // no temperature: GPT-5 only supports default (1)
    });

    const responseContent =
      completion?.choices?.[0]?.message?.content?.trim() ?? '';

    // mirror your GPT-4 response shape
    return res.status(200).json({ content: responseContent });
  } catch (error: any) {
    console.error('Error verifying token or processing OpenAI request:', error);
    if (isFirebaseAuthError(error) && error.errorInfo.code === 'auth/id-token-expired') {
      return res.status(403).json({ error: 'Session expired, please log in again.' });
    }
    return res.status(500).json({ error: 'Error processing your request.' });
  }
};
