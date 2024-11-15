//src/pages/api/get-ip.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';

type Data = {
  ip?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ipifyUrl = `https://api.ipify.org?format=json`;

  try {
    const response = await fetch(ipifyUrl);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ ip: data.ip });
    } else {
      res.status(response.status).json({ error: 'Failed to fetch IP address' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching IP address' });
  }
}
