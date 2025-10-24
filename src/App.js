import React from 'react';
import RazorpayPaymentButton from './RazorpayPaymentButton';
import './App.css';

function App() {
  const handlePaymentSuccess = (response) => {
    console.log("Payment successful:", response);
    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    // In a real application, you would typically send this payment ID to your server
    // to fulfill the order
  };

  const handlePaymentFailure = (response) => {
    console.error("Payment failed:", response);
    alert('Payment verification failed. Please try again.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Razorpay Payment Integration</h1>
        <p>Click the button below to make a payment with Razorpay</p>
        <RazorpayPaymentButton 
          amount={500} // Amount in rupees (will be converted to paise internally)
          currency="INR"
          name="Acme Corp"
          description="Test Transaction"
          image="https://example.com/your_logo.png" // Replace with your logo
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          prefill={{
            name: "John Doe",
            email: "john.doe@example.com",
            contact: "9999999999"
          }}
          notes={{
            address: "Razorpay Corporate Office"
          }}
          theme={{ color: "#3399cc" }}
        />
      </header>
    </div>
  );
}

export default App;