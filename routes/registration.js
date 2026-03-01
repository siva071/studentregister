const express = require('express');
const router = express.Router();
const { processRegistration } = require('../services/registrationService');

// STEP 1: Generate numeric unique ID and process registration
router.post('/', async (req, res) => {
    try {
        console.log('📥 Registration request received:', req.body);
        
        const result = await processRegistration(req.body);
        
        res.json({
            success: true,
            message: 'Registration successful',
            data: result[0].json
        });
        
        console.log('✅ Registration processed successfully');
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
