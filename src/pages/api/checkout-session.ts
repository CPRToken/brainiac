// pages/api/checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });
const db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Request body:', req.body);

  const { userId, userEmail, priceId, referrer } = req.body;

  // ✅ still enforce required fields
  if (!userId || !userEmail || !priceId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Always create a new Stripe customer
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { uid: userId },
    });

    // Save stripeCustomerId immediately into Firestore
    await db.collection('users').doc(userId).set(
      {
        stripeCustomerId: customer.id,
      },
      { merge: true }
    );

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.NEXT_PUBLIC_SUCCESS_URL!,
      cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL!,
      customer: customer.id,
      subscription_data: {
        trial_period_days: 3,
      },
      // ✅ include planName so webhook can pick it up
      metadata: {
        uid: userId,
        email: userEmail,
        priceId,
        referrer: referrer || '',

      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
};
