import type { NextApiRequest, NextApiResponse } from 'next';
import { handleWebhookEvent, verifyWebhookSignature } from '@/utils/paddle/helpers';
import { PADDLE_PUBLIC_KEY, PADDLE_VENDOR_AUTH_CODE } from '@/utils/paddle/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const webhookPayload = req.body;

      // Verify the webhook signature
      const isValidSignature = verifyWebhookSignature(webhookPayload, PADDLE_PUBLIC_KEY, PADDLE_VENDOR_AUTH_CODE);

      if (!isValidSignature) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      // Process the webhook payload
      await handleWebhookEvent(webhookPayload);

      res.status(200).json({ message: 'Webhook received' });
    } catch (error) {
      console.error('Error handling Paddle webhook:', error);
      res.status(500).json({ error: 'Failed to handle Paddle webhook' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
