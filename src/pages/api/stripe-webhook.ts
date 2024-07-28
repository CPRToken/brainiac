// pages/api/stripe-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import { Readable } from 'stream';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;

if (!stripeSecretKey || !stripeWebhookSecret) {
  console.error('Stripe keys are not properly defined!');
  throw new Error('Stripe keys are not defined.');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.error('Request method not allowed:', req.method);
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await streamToBuffer(req);
  const sig = req.headers['stripe-signature'];

  if (typeof sig !== 'string') {
    console.error('Stripe signature is missing or not a string.');
    return res.status(400).json({ error: 'Missing or invalid Stripe signature.' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret!);
    console.log('Event constructed:', event.type);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.paused':
      await handleSubscriptionPaused(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.resumed':
      await handleSubscriptionResumed(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.trial_will_end':
      await handleTrialWillEnd(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const uid = session.metadata?.uid;
  const priceId = session.metadata?.priceId;

  if (!uid || !priceId) {
    console.error('User ID or Price ID is missing in metadata.');
    throw new Error('User ID or Price ID is missing in metadata.');
  }

  const plan = productIdToPlan(priceId);
  await updateUserPlan(uid, plan, priceId);
  console.log(`User plan updated for ${uid} to ${plan} with price ${priceId}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  if (!uid) {
    console.error('User ID is missing in metadata.');
    throw new Error('User ID is missing in metadata.');
  }

  const plan = productIdToPlan(subscription.items.data[0].price.id);
  await updateUserPlan(uid, plan, subscription.items.data[0].price.id);
  console.log(`Subscription created for ${uid} with plan ${plan}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  if (!uid) {
    console.error('User ID is missing in metadata.');
    throw new Error('User ID is missing in metadata.');
  }

  await updateUserPlan(uid, 'None', '');
  console.log(`Subscription deleted for ${uid}`);
}

async function handleSubscriptionPaused(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  if (!uid) {
    console.error('User ID is missing in metadata.');
    throw new Error('User ID is missing in metadata.');
  }

  await updateUserPlan(uid, 'Paused', subscription.items.data[0].price.id);
  console.log(`Subscription paused for ${uid}`);
}

async function handleSubscriptionResumed(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  if (!uid) {
    console.error('User ID is missing in metadata.');
    throw new Error('User ID is missing in metadata.');
  }

  const plan = productIdToPlan(subscription.items.data[0].price.id);
  await updateUserPlan(uid, plan, subscription.items.data[0].price.id);
  console.log(`Subscription resumed for ${uid} with plan ${plan}`);
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  if (!uid) {
    console.error('User ID is missing in metadata.');
    throw new Error('User ID is missing in metadata.');
  }

  console.log(`Trial will end soon for ${uid}`);
  // Optionally send notification to user
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  if (!uid) {
    console.error('User ID is missing in metadata.');
    throw new Error('User ID is missing in metadata.');
  }

  const plan = productIdToPlan(subscription.items.data[0].price.id);
  await updateUserPlan(uid, plan, subscription.items.data[0].price.id);
  console.log(`Subscription updated for ${uid} to plan ${plan}`);
}

function productIdToPlan(priceId: string): string {
  const priceToPlan: Record<string, string> = {
    'price_1PgQI4I7exj9oAo949UmThhH': 'Basic',
    'price_1PgQJsI7exj9oAo9mUdbE0ZX': 'Premium',
    'price_1PgQKSI7exj9oAo9acr903Ka': 'Business'
  };
  return priceToPlan[priceId] || 'Unknown';
}

async function updateUserPlan(uid: string, plan: string, priceId: string) {
  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(uid);

  try {
    await userDocRef.update({ plan, priceId });
    console.log(`Successfully updated user ${uid} plan to ${plan} with price ${priceId}`);
  } catch (error) {
    console.error(`Failed to update Firestore for UID: ${uid}`, error);
    throw new Error('Failed to update user plan');
  }
}
