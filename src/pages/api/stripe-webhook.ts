// src/pages/api/stripe-webhook.ts

export const config = { api: { bodyParser: false } };

import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';
import { Readable } from 'stream';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
});

const pricePlanMap: Record<string, string> = {
  'price_1QNpMjI7exj9oAo9ColPjP1G': 'Basic',
  'price_1QNpQPI7exj9oAo9rx2W7jkg': 'BasicYearly',
  'price_1QNpZYI7exj9oAo9f2IXAwdx': 'Premium',
  'price_1PgQHUI7exj9oAo9f0qZ8g6W': 'PremiumYearly',
  'price_1QNpgKI7exj9oAo9DMTVCQBz': 'Business',
  'price_1QNpiKI7exj9oAo9CcI657sF': 'BusinessYearly',

  'price_1PgQI4I7exj9oAo949UmThhH': 'BasicTest',
 'price_1PgQJsI7exj9oAo9mUdbE0ZX': 'PremiumTest',
  'price_1PgQKSI7exj9oAo9acr903Ka': 'BusinessTest',
  'price_1PjDoqI7exj9oAo95jqY8uSw': 'BasicTestYearly',
  'price_1PjDpjI7exj9oAo9UkvkaR6x': 'PremiumTestYearly',
  'price_1PjDr8I7exj9oAo9lm4zAEDn': 'BusinessTestYearly',
  'price_canceled': 'Canceled',
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await streamToBuffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.status(200).json({ received: true });

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(err));
  });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed for session:', session.id);

  const stripeCustomerId = session.customer as string;
  const priceId = session.metadata?.priceId as string;
  const userId = session.metadata?.uid as string;
  const email = session.metadata?.email as string;
  const referrer = session.metadata?.referrer || null;

  const plan = pricePlanMap[priceId] || 'Pending';
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  try {
    if (userDoc.exists) {
      await userRef.update({
        plan,
        priceId,
        stripeCustomerId,
        referrer
      });
      console.log(`Updated existing user ${email} with new plan ${plan}`);
    } else {
      await userRef.set({
        uid: userId,
        email,
        plan,
        priceId,
        stripeCustomerId,
        referrer,
        role: 'User',
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created new user ${email} in Firestore`);
    }
  } catch (error: any) {
    console.error('Error updating/creating user:', error);
    throw new Error('Failed to update or create user');
  }
}

export default handler;
