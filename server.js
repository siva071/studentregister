const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import routes
const registrationRoutes = require('./routes/registration');
const webhookRoutes = require('./routes/webhook');
const paymentRoutes = require('./routes/payment');

// Use routes
app.use('/api/register', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/webhook', webhookRoutes);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Registration endpoint: /api/register`);
    console.log(`🪝 Webhook endpoint: /webhook/register`);
});
