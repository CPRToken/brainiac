import type { NextApiRequest, NextApiResponse } from 'next/types';
import fetch from 'node-fetch'; // You already have this for fetching
import admin from 'src/libs/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { pdfUrl, uid } = req.body; // Assuming you're sending a PDF URL

  if (!uid || !pdfUrl) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    // Fetch the PDF from the provided URL
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error('Failed to fetch PDF');

    const buffer = await response.buffer();
    const storage = admin.storage();
    const bucket = storage.bucket();
    const fileName = `${uid}/content/uploaded-${Date.now()}.pdf`; // Save in 'documents' directory
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: 'application/pdf' },
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

    res.status(200).json({ message: 'PDF uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
