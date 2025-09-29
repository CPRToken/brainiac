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

// helper to read the raw body for Stripe
function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let event: Stripe.Event;
  try {
    const buf = await streamToBuffer(req);
    const sig = req.headers['stripe-signature'] as string;
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler failed:', err);
    res.status(500).send('Webhook handler failed');
  }
}

// when checkout finishes (no trial)
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed for', session.id);

  const priceId = session.metadata?.priceId as string;
  const { uid: userId, email, referrer = null } = session.metadata || {};
  const stripeCustomerId = session.customer as string;

  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
  const product = price.product as Stripe.Product;
  const basePlan = product?.name || 'Unknown';
  const isYearly = price.recurring?.interval === 'year';
  const plan = isYearly ? `${basePlan}Yearly` : basePlan;

  const currency = (price.currency || '').toLowerCase();
  const preferredLanguage = currency === 'clp' ? 'es' : 'en';

  if (userDoc.exists) {
    await userRef.update({
      plan,
      priceId,
      stripeCustomerId,
      referrer,
      preferredLanguage
    });
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
      preferredLanguage
    });
    console.log(`Created user ${email} with plan ${plan}`);
  }

  // send normal welcome email
  await fetch('https://brainiacmedia.ai/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      lang: preferredLanguage,
      plan
    })
  });

  console.log(`Welcome email sent to ${email}`);
}

// when subscription with trial is created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.created for', subscription.id);

  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;

  const email = customer.email ?? '';
  const userId = (customer.metadata as any)?.uid ?? '';

  console.log('Trial email sending to:', email, 'userId:', userId);

  if (!email) {
    console.error('No email on customer', customerId);
    return;
  }

  const currency = (subscription.currency || '').toLowerCase();
  const preferredLanguage = currency === 'clp' ? 'es' : 'en';

  await fetch('https://brainiacmedia.ai/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      lang: preferredLanguage,
      plan: 'Trial'
    })
  });

  console.log(`Trial welcome email sent to ${email}`);
}
