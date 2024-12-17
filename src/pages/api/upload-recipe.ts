import type { NextApiRequest, NextApiResponse } from 'next/types';
import fetch from 'node-fetch';
import admin from 'src/libs/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { imageUrl, recipe, uid } = req.body;

  try {
    // Upload the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch image');

    const imageBuffer = await imageResponse.buffer();
    const storage = admin.storage();
    const bucket = storage.bucket();
    const timeStamp = Date.now();
    const imageFileName = `${uid}/recipes/image-${timeStamp}.png`;
    const imageFile = bucket.file(imageFileName);

    await imageFile.save(imageBuffer, {
      metadata: { contentType: 'image/png' },
    });

    const imagePublicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageFile.name)}?alt=media`;

    // Save the recipe text
    const recipeBuffer = Buffer.from(recipe);
    const recipeFileName = `${uid}/recipes/recipe-${timeStamp}.txt`;
    const recipeFile = bucket.file(recipeFileName);

    await recipeFile.save(recipeBuffer, {
      metadata: { contentType: 'text/plain' },
    });

    const recipePublicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(recipeFile.name)}?alt=media`;

    res.status(200).json({
      message: 'Story and image uploaded successfully',
      imageUrl: imagePublicUrl,
      recipeUrl: recipePublicUrl
    });
  } catch (error) {
    console.error('Error uploading recipe and image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
