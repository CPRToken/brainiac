import type { NextApiRequest, NextApiResponse } from 'next/types';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { address } = req.body;
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      // Process and send response data as needed
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error in Google Maps API call:", error);
      res.status(500).json({ error: "Error fetching coordinates." });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
