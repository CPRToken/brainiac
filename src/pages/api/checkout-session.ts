import { NextApiRequest, NextApiResponse } from 'next/types';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_TEST_SECRET_KEY is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { priceId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SUCCESS_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CANCEL_URL}`,
      metadata: {
        uid: userId,
        product_id: priceId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
};
