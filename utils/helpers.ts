import axios from 'axios';
import { PADDLE_PUBLIC_KEY, PADDLE_VENDOR_AUTH_CODE } from './paddle/config';
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
    // You can add additional logic here if needed, such as sending notifications or updating user data in Paddle
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

export const handleWebhookEvent = async (webhookPayload: PaddleWebhookPayload) => {
  try {
    const isValidSignature = verifyWebhookSignature(webhookPayload, PADDLE_PUBLIC_KEY, PADDLE_VENDOR_AUTH_CODE);

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
      case 'subscription_created':
        await handleSubscriptionCreated(webhookPayload.data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(webhookPayload.data);
        break;
      case 'payment_failed':
        await handlePaymentFailed(webhookPayload.data);
        break;
      default:
        console.log('Unhandled webhook event:', webhookPayload.alert_name);
    }
  } catch (error) {
    console.error('Error handling Paddle webhook:', error);
    throw error;
  }
};

export const verifyWebhookSignature = (webhookPayload: PaddleWebhookPayload, publicKey: string, vendorAuthCode: string): boolean => {
  const { p_signature, ...payload } = webhookPayload;
  const payloadString = JSON.stringify(payload);
  const expectedSignature = generateSignature(payloadString, publicKey, vendorAuthCode);

  return p_signature === expectedSignature;
};

const generateSignature = (payloadString: string, publicKey: string, vendorAuthCode: string): string => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha1', publicKey);
  hmac.update(payloadString);
  hmac.update(vendorAuthCode);
  return hmac.digest('hex');
};

const handleSubscriptionUpdate = async (subscriptionData: PaddleSubscriptionData) => {
  console.log('Subscription updated:', subscriptionData);
  // You can add additional logic here if needed, such as updating subscription data in Paddle
};

const handleSubscriptionCreated = async (subscriptionData: PaddleSubscriptionData) => {
  console.log('Subscription created:', subscriptionData);
  // You can add additional logic here if needed, such as creating a new subscription in Paddle
};

const handleSubscriptionCancelled = async (subscriptionData: PaddleSubscriptionData) => {
  console.log('Subscription cancelled:', subscriptionData);
  // You can add additional logic here if needed, such as canceling the subscription in Paddle
};

const handlePaymentFailed = async (paymentData: any) => {
  console.log('Payment failed:', paymentData);
  // You can add additional logic here if needed, such as handling failed payments
};
