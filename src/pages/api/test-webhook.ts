// pages/api/test-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';
import { Readable } from 'stream';

const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;

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
      case 'checkout.session.completed': {
        console.log('Handling checkout.session.completed event');
        const sessionId = (event.data.object as any).id;
        const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['customer'],
        }) as Stripe.Checkout.Session & { customer: Stripe.Customer | Stripe.DeletedCustomer };
        await handleCheckoutSessionCompleted(fullSession);
        break;
      }
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
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session & { customer: Stripe.Customer | Stripe.DeletedCustomer }) {
  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
  const priceId = session.metadata?.priceId;
  const userId = session.metadata?.uid;
  const email = session.metadata?.email;

  if (!stripeCustomerId || !priceId || !userId || !email) {
    console.error('Missing customer ID, price ID, email, or UID');
    throw new Error('Missing required metadata');
  }

  const plan = productIdToPlan(priceId);
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
        role: 'User',
        creationDate: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created new user ${email} in Firestore`);
    } else {
      await userRef.update({ plan, priceId });
      console.log(`Updated existing user ${email} plan to ${plan}`);
    }
  } catch (error: any) {
    console.error('Failed to create/update user in Firestore:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;

  if (!stripeCustomerId || !priceId) {
    console.error('Customer ID or Price ID is missing in subscription data.');
    throw new Error('Customer ID or Price ID is missing in subscription data.');
  }

  const plan = productIdToPlan(priceId);
  await updateUserPlan(stripeCustomerId, plan, priceId);
  console.log(`Subscription created for ${stripeCustomerId} with plan ${plan}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const priceId = subscription.metadata?.priceId as string;

  if (!stripeCustomerId || !priceId) {
    console.error('Customer ID or Price ID is missing in subscription data.');
    throw new Error('Customer ID or Price ID is missing in subscription data.');
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
  const plan = productIdToPlan(priceId);

  try {
    await userDoc.ref.update({ plan, priceId });
    console.log(`Successfully updated user ${stripeCustomerId} plan to ${plan} with price ${priceId}`);

    await sendCancellationEmail(userEmail, plan, stripeCustomerId);
  } catch (error) {
    console.error(`Failed to update Firestore for customer ID: ${stripeCustomerId}`, error);
    throw new Error('Failed to update user plan');
  }
}

async function sendCancellationEmail(email: string, plan: string, customerId: string) {
  const response = await fetch('/api/cancelled-email', {
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
    console.log(`Updating Firestore for customer ${stripeCustomerId} with plan ${plan} and priceId ${priceId}`);
    await userDoc.ref.update({ plan, priceId });
    console.log(`Successfully updated user ${stripeCustomerId} plan to ${plan} with price ${priceId}`);
  } catch (error: any) {
    console.error(`Failed to update Firestore for customer ID: ${stripeCustomerId}`, error);
    throw new Error('Failed to update user plan');
  }
}

function productIdToPlan(priceId: string): string {
  const priceToPlan: Record<string, string> = {
    'price_1PgQI4I7exj9oAo949UmThhH': 'Basic',
    'price_1PgQJsI7exj9oAo9mUdbE0ZX': 'Premium',
    'price_1PgQKSI7exj9oAo9acr903Ka': 'Business',
    'price_1PjDoqI7exj9oAo95jqY8uSw': 'BasicYearly',
    'price_1PjDpjI7exj9oAo9UkvkaR6x': 'PremiumYearly',
    'price_1PjDr8I7exj9oAo9lm4zAEDn': 'BusinessYearly',
    'price_canceled': 'Canceled'
  };

  return priceToPlan[priceId] || 'Unknown';
}

export default handler;
