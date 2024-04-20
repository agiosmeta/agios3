import type { NextApiRequest, NextApiResponse } from 'next';
import { initiateCheckout } from '@/utils/paddle/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { productId, userId } = req.body;

      // Initiate the Paddle checkout process
      const checkoutUrl = await initiateCheckout({ productId, userId });

      // Redirect the user to the Paddle checkout URL
      res.redirect(checkoutUrl);
    } catch (error) {
      console.error('Error initiating Paddle checkout:', error);
      res.status(500).json({ error: 'Failed to initiate Paddle checkout' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
