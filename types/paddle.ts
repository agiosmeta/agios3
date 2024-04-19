export interface PaddleSubscriptionData {
  subscription_id: string;
  user_id: string;
  // Add other relevant properties based on the Paddle API documentation
  // Example: product_id, status, etc.
}

export interface PaddleWebhookPayload {
  p_signature: string;
  alert_id: string;
  alert_name: string;
  alert_status: string;
  subscription_id: string;
  user_id: string;
  data: PaddleSubscriptionData | any;
}
