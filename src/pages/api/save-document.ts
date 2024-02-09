// src/pages/api/save-document.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import admin from 'src/libs/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  // Directly use the HTML docs and UID from the request body
  const { content: htmlContent, uid, title, category, shortDescription } = req.body; // Include shortDescription
  if (!uid || !htmlContent || !title || !shortDescription) {
    return res.status(400).json({ error: 'Missing content, UID, title, or shortDescription' });
  }


  try {
    const db = admin.firestore();


    const docRef = db.collection('users').doc(uid).collection('content').doc(title);

    await docRef.set({
      title,
      htmlContent,
      category,
      shortDescription, // Save the short description
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Document saved successfully', id: docRef.id });
  } catch (error) {
    console.error('Failed to save document:', error);
    res.status(500).json({ error: 'Failed to save document' });
  }
}
