import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error('Stripe keys are not defined');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });
const db = admin.firestore();

type PlanName = 'Basic' | 'Premium' | 'Business' | 'BasicYearly' | 'PremiumYearly' | 'BusinessYearly';

const planToPriceId: Record<PlanName, string> = {
  Basic: 'price_1Pk4zmI7exj9oAo9khc4OT16',
  Premium: 'price_1Pk4zkI7exj9oAo9N92hGKqe',
  Business: 'price_1Pk4ziI7exj9oAo95ZIL3sby',
  BasicYearly: 'price_1Pk4zgI7exj9oAo9DSyIUy8G',
  PremiumYearly: 'price_1Pk4zeI7exj9oAo9eUPovxQl',
  BusinessYearly: 'price_1Pk4zbI7exj9oAo9qsyipPNj',
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, userEmail, planName } = req.body;

  if (!userId || !userEmail || !planName) {
    return res.status(400).json({ error: 'userId, userEmail, and planName are required' });
  }

  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    let stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { uid: userId }
      });
      stripeCustomerId = customer.id;

      await userDocRef.update({ stripeCustomerId });
    }

    const priceId = planToPriceId[planName as PlanName];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_SUCCESS_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CANCEL_URL}`,
      customer: stripeCustomerId,
      metadata: {
        uid: userId,
        priceId
      },
    });

    await userDocRef.update({
      userId: session.id,
      priceId,
    });

    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
};
