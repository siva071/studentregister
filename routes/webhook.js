const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { processRegistration } = require('../services/registrationService');

// 🔒 Webhook Security Verification
const webhookSecret = "S8dj29Kd9@mockTest#2026!Rzp";

// STEP 3 — Payment Link Webhook Processing
router.post('/register', async (req, res) => {
    try {
        console.log('🪝 Razorpay Payment Link webhook received');
        
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
        
        if (event === 'payment_link.paid') {
            // STEP 3 — Extract Data from Payment Link Payload
            const paymentLink = req.body.payload.payment_link.entity;
            const payment = req.body.payload.payment.entity;
            
            if (!payment || payment.status !== 'captured') {
                throw new Error('Payment not successful');
            }
            
            // Generate UID
            const uniqueId = Date.now().toString();
            
            // Process registration with payment link data
            const registrationData = {
                uuid: uniqueId,
                name: paymentLink.customer?.name || 'Student',
                email: paymentLink.customer?.email,
                phone: paymentLink.customer?.contact,
                paymentId: payment.id,
                registeredAt: new Date().toISOString(),
                testStatus: 'registered'
            };
            
            console.log('📊 Payment Link registration data:', registrationData);
            
            await processRegistration(registrationData);
            console.log('✅ Payment Link webhook processed successfully');
        }
        
        res.json({ status: 'received' });
    } catch (error) {
        console.error('❌ Webhook error:', error.message);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Fallback webhook for direct form submission
router.post('/register-direct', async (req, res) => {
    try {
        console.log('📥 Direct registration webhook received:', req.body);
        
        const result = await processRegistration(req.body);
        
        res.json({
            success: true,
            message: 'Registration successful',
            data: result[0].json
        });
    } catch (error) {
        console.error('❌ Direct webhook error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
