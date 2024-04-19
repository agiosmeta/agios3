import React, { useState } from 'react';
import axios from 'axios';

const PaddleCheckout: React.FC = () => {
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [error, setError] = useState('');

  const initiateCheckout = async () => {
    try {
      const { data } = await axios.post('/api/paddle/checkout', {
        productId: 'your_product_id',
        userId: 'user_id',
      });

      setCheckoutUrl(data.checkoutUrl);
    } catch (error) {
      console.error('Error initiating Paddle checkout:', error);
      setError('Failed to initiate Paddle checkout');
    }
  };

  React.useEffect(() => {
    initiateCheckout();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (checkoutUrl) {
    // Redirect the user to the Paddle checkout URL
    window.location.href = checkoutUrl;
    return null;
  }

  return <div>Loading...</div>;
};

export default PaddleCheckout;
