import type { NextApiRequest, NextApiResponse } from 'next';
import { handleWebhookEvent } from '@/lib/paddle/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const webhookPayload = req.body;

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
