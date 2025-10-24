import React, { useEffect, useState } from 'react';

const RazorpayPaymentButton = ({ 
  amount, 
  currency = 'INR', 
  name,
  description,
  image,
  onSuccess,
  onFailure,
  prefill = {},
  notes = {},
  theme = { color: '#008ae6' },
  receipt = 'order_rcptid_11'
}) => {
  const [loading, setLoading] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createOrder = async () => {
    setLoading(true);
    try {
      // Create an order on the backend
      const response = await fetch('/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          receipt: receipt
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.orderId;
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      // Verify the payment on the backend
      const response = await fetch('/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Razorpay SDK is not loaded yet. Please wait and try again.');
      return;
    }

    try {
      // Create an order first
      const orderId = await createOrder();
      
      // Prepare payment options following Razorpay's official documentation
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Using environment variable from .env
        amount: amount * 100, // Amount is in currency subunits (paise for INR)
        currency,
        name,
        description,
        image,
        order_id: orderId, // Use the order ID from backend
        handler: async function(response) {
          // Verify the payment signature on the backend
          const isVerified = await verifyPayment(response);
          
          if (isVerified) {
            // Payment is successful and verified
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            console.log("Payment successful and verified:", response);
            if (onSuccess) onSuccess(response);
          } else {
            // Payment verification failed
            alert('Payment verification failed. Please contact support.');
            console.error("Payment verification failed:", response);
            if (onFailure) onFailure(response);
          }
        },
        prefill,
        notes,
        theme
      };

      // Create the Razorpay checkout instance
      const rzp = new window.Razorpay(options);
      
      // Open the checkout modal
      rzp.open();
    } catch (error) {
      console.error('Payment process failed:', error);
    }
  };

  return (
    <button 
      className="razorpay-button"
      onClick={handlePayment}
      type="button"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default RazorpayPaymentButton;