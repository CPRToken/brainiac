// src/pages/api/save-docimage.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import admin from 'src/libs/firebaseAdmin';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { content: htmlContent, uid, title, category, shortDescription, image } = req.body;

  // Validate required fields
  if (!uid || !htmlContent || !title || !shortDescription || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Fetch the image from the imageUrl provided in the request
    const response = await fetch(image);
    if (!response.ok) throw new Error('Failed to fetch image');

    const buffer = await response.buffer();
    const storage = admin.storage();
    const bucket = storage.bucket();

    // Generate a unique file name for the image
    const sanitizedTitle = sanitizeTitleForFilename(title);
    const fileName = `${sanitizedTitle}.png`;


    // Save the image to Firebase Storage
    const file = bucket.file(`${uid}/images/${fileName}`); // Ensuring path includes uid and images directory
    await file.save(buffer, {
      metadata: { contentType: 'image/png' },
    });

    // Obtain the public URL or reference path of the uploaded image
    const imagePath = `/${sanitizedTitle}.png`; // For example, use the file path as the reference

    // Save the post content along with the image reference to Firestore
    const db = admin.firestore();
    const docRef = db.collection('users').doc(uid).collection('content').doc(title.replace(/\s/g, "_"));
    await docRef.set({
      title,
      htmlContent,
      category,
      shortDescription,
      image: imagePath, // Save the Firebase Storage path as the image reference
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Document with image saved successfully', id: docRef.id });
  } catch (error) {
    console.error('Failed to save document with image:', error);
    res.status(500).json({ error: 'Failed to save document with image' });
  }
}

function sanitizeTitleForFilename(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

