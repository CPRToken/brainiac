import type { NextApiRequest, NextApiResponse } from 'next/types';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { address } = req.body;
      const response = await axios.get(`https://api.gateway.attomdata.com/propertyapi/v1.0.0/salescomparables/address/${encodeURIComponent(address)}`, {
        headers: { 'apikey': process.env.ATTOM_API_KEY },
        // Add other parameters or query customization as needed
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error in Attom Property Comparables API call:", error);
      res.status(500).json({ error: "Error fetching property comparables." });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
