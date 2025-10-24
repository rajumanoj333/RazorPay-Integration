# RazorPay-Integration
Integrating the RazorPay to Frontend React application

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your Razorpay credentials:
   > **Note:** A `.env.example` file has been provided as a template. Copy it and rename to `.env`, then add your actual credentials.
   ```env
   # Razorpay API Keys for backend
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Razorpay API Keys for frontend (if needed)
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Port for the server (optional, defaults to 5000)
   PORT=5000
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will be running at `http://localhost:3000`

## How to Use

The application includes a Razorpay payment button component that follows Razorpay's official integration guidelines:

- Amount (in rupees, automatically converted to currency subunits)
- Currency (INR by default)
- Order ID (generated from your backend)
- Business name and description
- Company logo image URL
- Prefill customer details (name, email, contact)
- Additional notes
- Custom theme colors
- Callback URL (optional)
- Custom handler function for payment responses

## Important Notes

- For testing, use Razorpay's test credentials (default in the code is a test key)
- For production, replace test credentials with live credentials in the .env file
- The amount is specified in rupees but internally converted to currency subunits (paise for INR, multiply by 100)
- The order ID should be generated from your backend after creating an order with Razorpay API
- Payment responses contain the payment ID which should be sent to your backend for verification
- Always verify payments on your backend before fulfilling orders
- The button component dynamically loads the Razorpay checkout script only when needed
