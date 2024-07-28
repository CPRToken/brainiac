//pages/api/get-stripe-session.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_TEST_SECRET_KEY is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

const db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userDocRef = db.collection('users').doc(uid as string);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const sessionId = userData?.stripeSessionId;

    if (!sessionId) {
      return res.status(404).json({ error: 'Stripe session ID not found for user' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const priceId = userData?.priceId;  // Ensure this is being set somewhere in your flow

    const responsePayload = {
      sessionDetails: session,
      priceId: priceId || 'Not available'  // Provide a fallback or handle absence gracefully
    };

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Failed to retrieve Stripe session:', error);
    res.status(500).json({ error: 'Failed to retrieve Stripe session' });
  }
};
