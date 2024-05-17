// pages/api/stripe-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import { Readable } from 'stream';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin'; // Check this import path matches your project structure
import { socialApi } from 'src/api/social/socialApi'; // Check this import path matches your project structure


const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_TEST_SECRET_KEY is not defined');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await streamToBuffer(req as any as Readable);
  const sig = req.headers['stripe-signature'];

  if (typeof sig !== 'string') {
    console.error('Stripe signature is missing or not valid.');
    return res.status(400).json({ error: 'Missing or invalid Stripe signature.' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_TEST_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId = subscription.customer as string;
    const productId = subscription.items.data[0].price.product as string;  // Type assertion to string

    const roleMap: { [key: string]: string } = {
      'prod_Q0F9YQ1SxkYSO0': 'basic',
      'prod_Q0FBiLl1W9cXSy': 'premium',
      'prod_Q0FBpvv3DNBh8C': 'business'
    };

    const newRole = roleMap[productId];  // Using productId as a key after asserting it as string

    if (!newRole) {
      console.error(`Product ID ${productId} does not match any known products.`);
      return res.status(400).json({ error: 'Product purchase not recognized' });
    }


    // Retrieve the corresponding Firestore user document using the stripeCustomerId
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('stripeCustomerId', '==', stripeCustomerId).get();

    if (querySnapshot.empty) {
      console.error('No Firestore document found for the given Stripe customer ID:', stripeCustomerId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming there is exactly one matching user document
    const userDoc = querySnapshot.docs[0];

    // Update the Firestore user document with new role
    await userDoc.ref.update({ role: newRole });
    console.log(`Updated role to ${newRole} for user with Stripe customer ID: ${stripeCustomerId}`);

    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ error: 'Invalid event type' });
  }
}
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => {
      resolve(Buffer.concat(chunks)); // Concatenate all chunks into one Buffer
    });
    stream.on('error', (err) => {
      reject(err); // Forward any errors encountered during streaming
    });
  });
}
