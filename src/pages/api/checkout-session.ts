  // pages/api/checkout-session.ts
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

  export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    console.log('Request body:', req.body);

    const { userId, userEmail, planName, priceId } = req.body;

    if (!userId || !userEmail || !planName || !priceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // After creating the customer and session:
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { uid: userId },
      });

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: process.env.NEXT_PUBLIC_SUCCESS_URL!,
        cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL!,
        customer: customer.id,
        subscription_data: {
          trial_period_days: 1,
        },
        metadata: {
          uid: userId,
          email: userEmail,
          priceId,
        },
      });

  // Update Firestore with the Stripe customer id
      const userDocRef = db.collection('users').doc(userId);
      await userDocRef.update({
        stripeCustomerId: customer.id,
        stripeSessionId: session.id,  // optional but useful for reference
        priceId,
      });


      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Error creating checkout session' });
    }
  };
