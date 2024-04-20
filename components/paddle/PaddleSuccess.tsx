import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleSuccessfulPayment } from '@/lib/paddle/helpers';

const PaddleSuccess: React.FC = () => {
  const router = useRouter();
  const { paymentData } = router.query;

  useEffect(() => {
    if (paymentData) {
      handleSuccessfulPayment(paymentData)
        .then(() => {
          // Perform any additional actions after successful payment handling
          console.log('Successful payment handled');
        })
        .catch((error) => {
          console.error('Error handling successful payment:', error);
          // Display an error message or fallback UI
        });
    }
  }, [paymentData]);

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
    </div>
  );
};

export default PaddleSuccess;
