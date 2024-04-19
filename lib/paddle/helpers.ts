import axios from 'axios';
import { PADDLE_PUBLIC_KEY, PADDLE_VENDOR_AUTH_CODE } from './config';
import { PaddleWebhookPayload } from '@/types/paddle';

export const initiateCheckout = async ({ productId, userId }) => {
  // Existing initiateCheckout function implementation
};

export const handleSuccessfulPayment = async (paymentData) => {
  // Existing handleSuccessfulPayment function implementation
};

export const handleWebhookEvent = async (webhookPayload: PaddleWebhookPayload) => {
  try {
    // Verify the webhook payload signature
    const isValidSignature = verifyWebhookSignature(webhookPayload);

    if (!isValidSignature) {
      throw new Error('Invalid webhook signature');
    }

    // Process the webhook payload based on the event type
    switch (webhookPayload.alert_name) {
      case 'payment_succeeded':
        await handleSuccessfulPayment(webhookPayload.data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdate(webhookPayload.data);
        break;
      // Handle other webhook event types as needed
      default:
        console.log('Unhandled webhook event:', webhookPayload.alert_name);
    }
  } catch (error) {
    console.error('Error handling Paddle webhook:', error);
    throw error;
  }
};

// Helper function to verify the webhook payload signature
const verifyWebhookSignature = (webhookPayload: PaddleWebhookPayload): boolean => {
  const { p_signature, ...payload } = webhookPayload;
  const payloadString = JSON.stringify(payload);
  const expectedSignature = generateSignature(payloadString);

  return p_signature === expectedSignature;
};

// Helper function to generate the expected signature
const generateSignature = (payloadString: string): string => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha1', PADDLE_PUBLIC_KEY);
  hmac.update(payloadString);
  hmac.update(PADDLE_VENDOR_AUTH_CODE);
  return hmac.digest('hex');
};

// Helper function to handle subscription updates
const handleSubscriptionUpdate = async (subscriptionData) => {
  // Implement the logic to handle subscription updates
  console.log('Subscription updated:', subscriptionData);
};
