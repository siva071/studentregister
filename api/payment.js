const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
app.post('/api/payment/create-order', async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;
        
        const options = {
            amount: amount,
            currency: currency || 'INR',
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {}
        };
        
        const order = await razorpay.orders.create(options);
        
        console.log('💳 Razorpay order created:', order.id);
        
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        });
        
    } catch (error) {
        console.error('❌ Razorpay order creation error:', error);
        res.status(500).json({
            error: 'Failed to create payment order',
            message: error.message
        });
    }
});

// Verify payment signature
app.post('/api/payment/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        
        if (generated_signature === razorpay_signature) {
            res.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
        
    } catch (error) {
        console.error('❌ Payment verification error:', error);
        res.status(500).json({
            error: 'Payment verification failed',
            message: error.message
        });
    }
});

// For Vercel, export as a function
module.exports = app;
