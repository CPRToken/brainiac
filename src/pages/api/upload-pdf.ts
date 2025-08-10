import type { NextApiRequest, NextApiResponse } from 'next/types';

import admin from 'src/libs/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { file, uid } = req.body;
  try {
    const buffer = file.buffer; // Assuming the file is available as a buffer
    const storage = admin.storage();
    const bucket = storage.bucket();
    const fileName = `${uid}/pdfs/uploaded-${Date.now()}.pdf`; // Save PDF in a separate directory
    const pdfFile = bucket.file(fileName);

    await pdfFile.save(buffer, {
      metadata: { contentType: 'application/pdf' },
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(pdfFile.name)}?alt=media`;

    res.status(200).json({ message: 'PDF uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
