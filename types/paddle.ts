export interface PaddleWebhookPayload {
    p_signature: string;
    alert_id: string;
    alert_name: string;
    alert_status: string;
    data: any;
    // Add any other properties present in the Paddle webhook payload
  }
  