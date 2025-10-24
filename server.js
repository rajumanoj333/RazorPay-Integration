const express = require('express');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Initialize Razorpay instance
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.REACT_APP_RAZORPAY_KEY_SECRET
});

// Route to create an order
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'order_rcptid_11' } = req.body;

    const options = {
      amount: amount * 100, // Convert to smallest currency unit (paise)
      currency,
      receipt,
      notes: {
        description: 'Order creation for payment'
      }
    };

    const order = await razorpayInstance.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route to verify payment
app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create the signature verification string
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || process.env.REACT_APP_RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare the signatures
    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      res.json({
        success: true,
        message: 'Payment verification successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Serve the React app (fallback for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;