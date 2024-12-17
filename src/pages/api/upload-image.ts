import type { NextApiRequest, NextApiResponse } from 'next/types';
import fetch from 'node-fetch';
import admin from 'src/libs/firebaseAdmin';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { imageUrl, uid } = req.body;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');

    const buffer = await response.buffer();
    const storage = admin.storage();
    const bucket = storage.bucket();
    const fileName = `${uid}/images/uploaded-${Date.now()}.png`; // Include UID in the path
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: 'image/png' },
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

    res.status(200).json({ message: 'Image uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
