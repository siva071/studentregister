const express = require('express');
const crypto = require('crypto');
const { processRegistration } = require('../services/registrationService');

const app = express();

// Middleware
app.use(express.json());

// 🔒 Webhook Security Verification
const webhookSecret = "MockTest@2026#SecureRzpKey!991";

// Razorpay webhook endpoint
app.post('/webhook/register', async (req, res) => {
    try {
        console.log('🪝 Razorpay webhook received');
        
        // Verify webhook signature
        const body = JSON.stringify(req.body);
        const signature = req.headers['x-razorpay-signature'];
        
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');
        
        if (expectedSignature !== signature) {
            console.log('❌ Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        console.log('✅ Webhook signature verified');
        
        // Extract payment event data
        const event = req.body.event;
        
        if (event === 'payment.captured') {
            // STEP 4 — Extract Required Data from Razorpay Payload
            const payment = req.body.payload.payment.entity;
            
            if (!payment || payment.status !== 'captured') {
                throw new Error('Payment not captured');
            }
            
            // Generate UID
            const uniqueId = Date.now().toString();
            
            // Process registration with payment data
            const registrationData = {
                uuid: uniqueId,
                name: payment.notes?.name || '',
                email: payment.notes?.email || '',
                phone: payment.notes?.phone || '',
                dob: payment.notes?.dob || '',
                paymentId: payment.id,
                registeredAt: new Date().toISOString(),
                testStatus: 'registered'
            };
            
            console.log('📊 Registration data:', registrationData);
            
            await processRegistration(registrationData);
            console.log('✅ Payment webhook processed successfully');
        }
        
        res.json({ status: 'received' });
    } catch (error) {
        console.error('❌ Webhook error:', error.message);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// For Vercel, export as a function
module.exports = app;
