const express = require('express');
const cors = require('cors');
const { processRegistration } = require('../services/registrationService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
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

// For Vercel, export as a function
module.exports = app;
