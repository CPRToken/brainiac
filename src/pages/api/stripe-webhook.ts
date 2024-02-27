import { NextApiRequest, NextApiResponse } from 'next/types';
import admin from 'src/libs/firebaseAdmin'; // Import your Firebase Admin instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const event = req.body;

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      // Extract relevant data from the event
      const customerId = event.data.object.customer;
      const productId = event.data.object.metadata.product_id;

      // Retrieve user from Firestore based on the customer ID
      try {
        const userRef = admin.firestore().collection('users').doc(customerId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          console.error(`User with customer ID ${customerId} not found in database.`);
          return res.status(404).json({ error: 'User not found' });
        }

        const premiumProductId = 'prod_P2YLq0FXmxSQMf'; // Replace with your actual premium product ID from Stripe
        const basicProductId = 'prod_PdiBaofSU3VbYA'; // Replace with your actual basic product ID from Stripe

        let newRole = '';

        // Update user's role based on the product purchased
        if (productId === premiumProductId) {
          newRole = 'premium';
        } else if (productId === basicProductId) {
          newRole = 'basic';
        } else {
          // If the product doesn't match any ID, log and skip updating
          console.log(`Product ID ${productId} does not match any known products.`);
          return res.status(400).json({ error: 'Product purchase not recognized' });
        }

        // Proceed to update the user's role
        await userRef.update({ role: newRole });

        console.log(`User with customer ID ${customerId} purchased product ${productId}.`);
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid event type' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
