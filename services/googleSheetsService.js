const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const appendToGoogleSheet = async (data) => {
    try {
        const auth = new GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const range = 'Sheet1!A:H'; // Adjust range based on your sheet
        
        const values = [
            [
                data.uuid,
                data.name,
                data.email,
                data.phone,
                data.paymentId,
                data.registeredAt,
                data.dob,
                data.testStatus
            ]
        ];
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: { values }
        });
        
        console.log('✅ Google Sheets update successful:', response.data.updates.updatedRows);
        return response.data;
    } catch (error) {
        console.error('❌ Google Sheets error:', error.message);
        throw new Error('Failed to append to Google Sheet');
    }
};

module.exports = { appendToGoogleSheet };
