const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_1O5H3Y8rEYfZLJ', // Test key for demonstration
    key_secret: 'your_secret_here'
});

// Create payment order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;
        
        // For testing - return mock order without Razorpay API
        console.log('🧪 Creating mock order for testing');
        
        const mockOrder = {
            id: `order_mock_${Date.now()}`,
            amount: amount,
            currency: currency || 'INR',
            receipt: receipt || `receipt_${Date.now()}`,
            status: 'created'
        };
        
        console.log('💳 Mock order created:', mockOrder.id);
        
        res.json({
            id: mockOrder.id,
            amount: mockOrder.amount,
            currency: mockOrder.currency,
            receipt: mockOrder.receipt
        });
        
    } catch (error) {
        console.error('❌ Order creation error:', error.message);
        res.status(500).json({
            error: 'Failed to create payment order',
            message: error.message
        });
    }
});

// Verify payment signature
router.post('/verify', async (req, res) => {
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

module.exports = router;
