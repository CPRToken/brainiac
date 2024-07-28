// pages/api/create-billing-portal-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe keys are not defined');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'User does not have a Stripe customer ID' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_RETURN_URL,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({ error: 'Error creating billing portal session' });
  }
};
