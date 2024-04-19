import axios from 'axios';
import { PADDLE_PUBLIC_KEY, PADDLE_VENDOR_AUTH_CODE } from '/workspaces/agios3/lib/paddle/config';
import { PaddleWebhookPayload, PaddleSubscriptionData } from '@/types/paddle';

export const initiateCheckout = async ({ productId, userId }: { productId: string; userId: string }) => {
  try {
    const response = await axios.post('https://checkout.paddle.com/api/2.0/checkout/open', {
      product_id: productId,
      user_id: userId,
    });

    return response.data.checkout_url;
  } catch (error) {
    console.error('Error initiating Paddle checkout:', error);
    throw error;
  }
};

export const handleSuccessfulPayment = async (paymentData: any) => {
  try {
    console.log('Successful payment:', paymentData);

    // Update the user's subscription status or perform any other required actions
    // ...
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

export const handleWebhookEvent = async (webhookPayload: PaddleWebhookPayload) => {
  try {
    const isValidSignature = verifyWebhookSignature(webhookPayload);

    if (!isValidSignature) {
      throw new Error('Invalid webhook signature');
    }

    switch (webhookPayload.alert_name) {
      case 'payment_succeeded':
        await handleSuccessfulPayment(webhookPayload.data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdate(webhookPayload.data);
        break;
      default:
        console.log('Unhandled webhook event:', webhookPayload.alert_name);
    }
  } catch (error) {
    console.error('Error handling Paddle webhook:', error);
    throw error;
  }
};

const verifyWebhookSignature = (webhookPayload: PaddleWebhookPayload): boolean => {
  const { p_signature, ...payload } = webhookPayload;
  const payloadString = JSON.stringify(payload);
  const expectedSignature = generateSignature(payloadString);

  return p_signature === expectedSignature;
};

const generateSignature = (payloadString: string): string => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha1', PADDLE_PUBLIC_KEY);
  hmac.update(payloadString);
  hmac.update(PADDLE_VENDOR_AUTH_CODE);
  return hmac.digest('hex');
};

const handleSubscriptionUpdate = async (subscriptionData: PaddleSubscriptionData) => {
  console.log('Subscription updated:', subscriptionData);
};
