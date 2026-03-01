const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order (₹1 default)
app.post("/create-order", async (req, res) => {
  try {
    const amount = 1; // change later if needed

    const order = await razorpay.orders.create({
      amount: amount * 100, // rupees to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Order failed");
  }
});

// Verify Payment
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Razorpay Webhook - Send complete user data to n8n
app.post("/webhook/razorpay", (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'razorpay_webhook_secret';
  
  // Verify webhook signature
  const razorpay_signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  if (razorpay_signature !== expectedSignature) {
    console.log('❌ Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  // Extract payment data
  const payment = req.body.payload.payment.entity;
  const notes = payment.notes || {};
  
  // Complete user registration data
  const userData = {
    // Payment Information
    payment_id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    payment_method: payment.method,
    bank: payment.bank,
    wallet: payment.wallet,
    vpa: payment.vpa,
    created_at: payment.created_at,
    
    // User Information (from Razorpay customer data)
    user_name: payment.description || notes.name || 'Unknown',
    user_email: payment.email || notes.email || '',
    user_phone: payment.contact || notes.phone || '',
    
    // Registration Details (from notes)
    uid: notes.uid || '',
    registration_name: notes.name || '',
    registration_email: notes.email || '',
    registration_phone: notes.phone || '',
    registration_dob: notes.dob || '',
    registration_type: notes.registration_type || 'RRB_NTPC_MOCK_TEST',
    
    // Additional Details
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    webhook_received_at: new Date().toISOString(),
    
    // Original Razorpay Data
    razorpay_payload: req.body
  };
  
  console.log('🔔 Razorpay webhook received - Complete user data:', userData);
  
  // Send complete data to n8n webhook
  fetch('https://n8nnserver.duckdns.org/webhook/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Complete user data sent to n8n successfully:', data);
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      user_data_sent: true
    });
  })
  .catch(error => {
    console.error('❌ Error sending user data to n8n:', error);
    res.status(500).json({ error: 'Failed to send user data to n8n' });
  });
});

app.listen(PORT, () => console.log("Server running"));
