// pages/api/stripe-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';
import { Readable } from 'stream';
import { getPriceId } from 'src/utils/getPriceId';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    const buf = await streamToBuffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret!);
  } catch (error: any) {
    console.error('Error verifying webhook signature:', error);
    return res.status(400).send('Webhook Error: Signature verification failed');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Handling checkout.session.completed event');
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
        console.log('Handling customer.subscription.created event');
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        console.log('Handling customer.subscription.deleted event');
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        console.log('Handling customer.subscription.updated event');
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error: any) {
    console.error('Error handling event:', error);
    return res.status(500).send('Internal Server Error');
  }

  res.json({ received: true });
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err: Error) => reject(err));
  });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const stripeCustomerId = session.customer as string;
  const priceId = session.metadata?.priceId;
  const userId = session.metadata?.uid;
  const email = session.metadata?.email;

  if (!stripeCustomerId || !priceId || !userId || !email) {
    console.error('Missing customer ID, price ID, UID or email');
    throw new Error('Missing required metadata');
  }

  const plan = getPriceId(priceId);
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const referrer = session.metadata?.referrer || null;

  try {
    if (!userDoc.exists) {
      await userRef.set({
        uid: userId,
        email,
        plan,
        priceId,
        stripeCustomerId,
        referrer, // ✅ Save it in Firestore
        role: 'User',
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created new user ${email} in Firestore`);
    } else {
      await userRef.update({ plan, priceId });
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

  if (!stripeCustomerId || !priceId) {
    console.error('Customer ID or Price ID is missing in subscription data.');
    throw new Error('Customer ID or Price ID is missing in subscription data.');
  }

  const plan = getPriceId(priceId);
  await updateUserPlan(stripeCustomerId, plan, priceId);
  console.log(`Subscription created for ${stripeCustomerId} with plan ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  if (!stripeCustomerId || !priceId) {
    console.error('Customer ID or Price ID is missing in subscription update.');
    throw new Error('Customer ID or Price ID is missing in subscription update.');
  }

  const plan = cancelAtPeriodEnd ? 'CancelPending' : getPriceId(priceId);
  const priceToSet = cancelAtPeriodEnd ? 'price_cancel_pending' : priceId;

  await updateUserPlan(stripeCustomerId, plan, priceToSet);
  console.log(`Subscription updated for ${stripeCustomerId} - plan: ${plan}, cancel at period end: ${cancelAtPeriodEnd}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;

  if (!stripeCustomerId) {
    console.error('Customer ID is missing in subscription data.');
    throw new Error('Customer ID is missing in subscription data.');
  }

  const db = admin.firestore();
  const userDocRef = db.collection('users').where('stripeCustomerId', '==', stripeCustomerId);
  const querySnapshot = await userDocRef.get();

  if (querySnapshot.empty) {
    console.error('No matching documents found for stripeCustomerId:', stripeCustomerId);
    throw new Error('No matching documents found');
  }

  const userDoc = querySnapshot.docs[0];
  const userEmail = userDoc.data().email as string;
  const priceId = 'price_canceled';
  const plan = getPriceId(priceId);

  try {
    await userDoc.ref.update({ plan, priceId });
    console.log(`Updated user ${stripeCustomerId} plan to ${plan}`);
    await sendCancellationEmail(userEmail, plan, stripeCustomerId);
  } catch (error) {
    console.error(`Failed to update Firestore for ${stripeCustomerId}`, error);
    throw new Error('Failed to update user plan');
  }
}

async function updateUserPlan(stripeCustomerId: string, plan: string, priceId: string | null) {
  const db = admin.firestore();
  const userDocRef = db.collection('users').where('stripeCustomerId', '==', stripeCustomerId);
  const querySnapshot = await userDocRef.get();

  if (querySnapshot.empty) {
    console.error('No matching documents found for stripeCustomerId:', stripeCustomerId);
    throw new Error('No matching documents found');
  }

  const userDoc = querySnapshot.docs[0];

  try {
    await userDoc.ref.update({ plan, priceId });
    console.log(`Successfully updated user ${stripeCustomerId} to plan ${plan}`);
  } catch (error: any) {
    console.error(`Failed to update Firestore for ${stripeCustomerId}`, error);
    throw new Error('Failed to update user plan');
  }
}

async function sendCancellationEmail(email: string, plan: string, customerId: string) {
  const response = await fetch('https://your-domain.com/api/cancelled-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, customerEmail: email, plan, stripeCustomerId: customerId }),
  });

  if (!response.ok) {
    console.error('Failed to send cancellation email for:', customerId);
  } else {
    const responseData = await response.json();
    console.log('Cancellation email sent successfully:', responseData);
  }
}

export default handler;
