import type { NextApiRequest, NextApiResponse } from 'next/types';

import admin from 'src/libs/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { imageUrl, story, uid } = req.body;

  try {
    // Upload the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch image');

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const storage = admin.storage();
    const bucket = storage.bucket();
    const timeStamp = Date.now();
    const imageFileName = `${uid}/stories/image-${timeStamp}.png`;
    const imageFile = bucket.file(imageFileName);

    await imageFile.save(imageBuffer, {
      metadata: { contentType: 'image/png' },
    });

    const imagePublicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageFile.name)}?alt=media`;

    // Save the story text
    const storyBuffer = Buffer.from(story);
    const storyFileName = `${uid}/stories/story-${timeStamp}.txt`;
    const storyFile = bucket.file(storyFileName);

    await storyFile.save(storyBuffer, {
      metadata: { contentType: 'text/plain' },
    });

    const storyPublicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storyFile.name)}?alt=media`;

    res.status(200).json({
      message: 'Story and image uploaded successfully',
      imageUrl: imagePublicUrl,
      storyUrl: storyPublicUrl
    });
  } catch (error) {
    console.error('Error uploading story and image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
