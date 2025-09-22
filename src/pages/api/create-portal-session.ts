//src/pages/api/create-portal-session.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    const userDoc = await admin.firestore().doc(`users/${uid}`).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stripeCustomerId = userDoc.data()?.stripeCustomerId;
    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Missing stripeCustomerId' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: 'https://brainiacmedia.ai',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

