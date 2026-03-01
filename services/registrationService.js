const { appendToGoogleSheet } = require('./googleSheetsService');
const { sendWelcomeEmail } = require('./emailService');

const processRegistration = async (body) => {
    const now = new Date().toISOString();
    
    // Generate numeric unique ID (example: 202602281234)
    const uniqueId = Date.now().toString();
    
    // Validate required fields
    if (!body.name || !body.email || !body.dob) {
        throw new Error('Missing required fields: name, email, dob');
    }
    
    const registrationData = {
        uuid: uniqueId,
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        paymentId: body.paymentId || '',
        registeredAt: now,
        dob: body.dob,
        testStatus: 'registered'
    };
    
    console.log('🔢 Generated UID:', uniqueId);
    console.log('📊 Registration data:', registrationData);
    
    try {
        // Try to actually save to Google Sheets and send email
        console.log('🔄 Processing registration with external services...');
        
        // Append to Google Sheet
        try {
            await appendToGoogleSheet(registrationData);
            console.log('📄 Data appended to Google Sheet');
        } catch (sheetError) {
            console.log('⚠️ Google Sheet error:', sheetError.message);
            // Continue even if Google Sheets fails
        }
        
        // Send welcome email
        try {
            await sendWelcomeEmail(registrationData);
            console.log('📧 Welcome email sent to:', body.email);
        } catch (emailError) {
            console.log('⚠️ Email error:', emailError.message);
            // Continue even if email fails
        }
        
        console.log('✅ Registration processed successfully');
        return [{ json: registrationData }];
    } catch (error) {
        console.error('❌ Error in registration process:', error);
        throw error;
    }
};

module.exports = { processRegistration };
