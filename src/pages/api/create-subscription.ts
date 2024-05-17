import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';
import admin from 'src/libs/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, { apiVersion: '2024-04-10' });

async function findOrCreateStripeCustomer(email: string): Promise<Stripe.Customer> {
  const usersRef = admin.firestore().collection('users');
  const querySnapshot = await usersRef.where('email', '==', email).get();

  // Handle the case where no users are found with the provided email
  if (querySnapshot.empty) {
    // Optionally, handle this scenario based on your business logic, e.g., create a new user, throw an error, etc.
    throw new Error('No user found with the provided email');
  }

  const userData = querySnapshot.docs[0].data();
  if (userData.stripeCustomerId) {
    // Customer exists in Stripe, retrieve them
    return stripe.customers.retrieve(userData.stripeCustomerId) as Promise<Stripe.Customer>;
  }

  // No customer ID in Firestore, create a new Stripe customer
  const newCustomer = await stripe.customers.create({
    email: email,
    metadata: {
      firebaseUID: querySnapshot.docs[0].id
    }
  });

  // Store the new Stripe customer ID in Firestore
  await usersRef.doc(querySnapshot.docs[0].id).update({
    stripeCustomerId: newCustomer.id
  });

  return newCustomer;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, planId } = req.body;

  try {
    const customer = await findOrCreateStripeCustomer(email);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Update Firestore with the Stripe customer ID and subscription info
    const userRef = admin.firestore().collection('users').doc(customer.metadata.firebaseUID);
    await userRef.update({
      stripeCustomerId: customer.id,
      subscriptionStatus: subscription.status,
    });

    res.status(200).json(subscription);
  } catch (error) { // Closing bracket for try block added here
    console.error('Subscription creation failed:', error);
    const message = (error as Error).message; // Type assertion
    res.status(500).json({ error: 'Failed to create subscription', details: message });
  }
};
