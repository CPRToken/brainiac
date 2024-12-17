// pages/api/getCountry.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
      considerIp: true
    });
    const country = response.data.location?.country || 'US';
    res.status(200).json({ country });
  } catch (error) {
    console.error('Failed to determine location:', error);
    res.status(500).json({ error: 'Failed to determine location' });
  }
}
