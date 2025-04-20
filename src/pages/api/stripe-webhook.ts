// src/pages/api/stripe-webhook.ts

// Disable Next.js body parsing so we receive the raw request
export const config = { api: { bodyParser: false } };

import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';
import { Readable } from 'stream';
import { getPriceId } from 'src/utils/getPriceId';

// Assert environment variables exist and are strings
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY!;
const stripeWebhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error('Stripe keys are not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Read raw body for signature verification
  const buf = await streamToBuffer(req);
  // Stripe signature header should be a single string
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Acknowledge Stripe receipt
  res.status(200).json({ received: true });

  // Handle events asynchronously
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }
}

// Helper to convert readable stream to buffer
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

  const plan = getPriceId(priceId);
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  try {
    if (!userDoc.exists) {
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
    } else {
      await userRef.update({ plan, priceId, referrer });
      console.log(`Updated existing user ${email} with new plan ${plan}`);
    }
  } catch (error: any) {
    console.error('Error updating/creating user:', error);
    throw new Error('Failed to update or create user');
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  const plan = getPriceId(priceId);
  await updateUserPlan(stripeCustomerId, plan, priceId);
  console.log(`Subscription created for ${stripeCustomerId} with plan ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const plan = cancelAtPeriodEnd ? 'CancelPending' : getPriceId(priceId);
  const priceToSet = cancelAtPeriodEnd ? 'price_cancel_pending' : priceId;
  await updateUserPlan(stripeCustomerId, plan, priceToSet);
  console.log(`Subscription updated for ${stripeCustomerId} - plan: ${plan}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const db = admin.firestore();
  const userDocRef = db.collection('users').where('stripeCustomerId', '==', stripeCustomerId);
  const querySnapshot = await userDocRef.get();
  if (querySnapshot.empty) {
    console.error('No matching documents found for stripeCustomerId:', stripeCustomerId);
    return;
  }
  const userDoc = querySnapshot.docs[0];
  const userEmail = userDoc.data().email as string;

  try {
    await userDoc.ref.update({ plan: 'Canceled', priceId: 'price_canceled' });
    console.log(`Canceled subscription for ${stripeCustomerId}`);
    await sendCancellationEmail(userEmail, 'Canceled', stripeCustomerId);
  } catch (err) {
    console.error(`Failed to cancel subscription for ${stripeCustomerId}`, err);
  }
}

async function updateUserPlan(stripeCustomerId: string, plan: string, priceId: string | null) {
  const db = admin.firestore();
  const userDocRef = db.collection('users').where('stripeCustomerId', '==', stripeCustomerId);
  const querySnapshot = await userDocRef.get();
  if (querySnapshot.empty) {
    console.error('No matching documents found for stripeCustomerId:', stripeCustomerId);
    return;
  }
  const userDoc = querySnapshot.docs[0];
  await userDoc.ref.update({ plan, priceId });
}

async function sendCancellationEmail(email: string, plan: string, customerId: string) {
  await fetch('https://your-domain.com/api/cancelled-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, plan, stripeCustomerId: customerId }),
  });
}

export default handler;
