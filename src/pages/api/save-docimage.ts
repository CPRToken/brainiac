// src/pages/api/save-docimage.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import admin from 'src/libs/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { content: htmlContent, uid, title, category, images, shortDescription } = req.body;

  if (!uid || !htmlContent || !title || !shortDescription || !images) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = admin.firestore();
    const storage = admin.storage();
    const documentId = title.replace(/\s/g, "_");
    const docRef = db.collection('users').doc(uid).collection('content').doc(documentId);

    // Upload images and get their URLs
    const imageUploadPromises = images.map(async (image: string, index: number) => {
      const imageBuffer = Buffer.from(image, 'base64');
      const imageRef = storage.bucket().file(`content/${uid}/${documentId}/image_${index}`);
      await imageRef.save(imageBuffer, {
        metadata: { contentType: 'image/jpeg' }, // Adjust based on actual image type
      });
      const [url] = await imageRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });
      return url; // Return the URL for each image
    });

    const imageUrl = await Promise.all(imageUploadPromises);

    // Save document with image URLs in Firestore
    await docRef.set({
      title,
      htmlContent,
      category,
      shortDescription,
      images: [imageUrl], // Save as an array if your structure expects it
      // ...rest of your document fields
    });

    res.status(200).json({ message: 'Document with image saved successfully', id: docRef.id });
  } catch (error) {
    console.error('Failed to save document with image:', error);
    res.status(500).json({ error: 'Failed to save document with image' });
  }
}
