# 🎓 Student Registration System with Razorpay Payment

A complete student registration system with automatic UID generation and Razorpay payment integration built with Node.js and Express.

## 🚀 Features

### ✅ STEP 1 — Automatic UID Generation
- **Numeric-only UIDs** using `Date.now()` timestamp
- **100% unique** for every registration
- **No user input required** for UID generation

### ✅ STEP 2 — Razorpay Payment Integration
- **Secure payment gateway** integration
- **Real-time payment verification**
- **Automatic form data submission** after payment success
- **Payment ID capture** for records

### ✅ STEP 3 — Secure Webhook System
- **Razorpay webhook verification** with signature validation
- **Direct registration fallback** for testing
- **Anti-fake payment protection**

### ✅ STEP 4 — Email Notifications
- **Welcome emails** with UID and registration details
- **Professional HTML email templates**
- **Gmail SMTP integration**

### ✅ STEP 5 — Google Sheets Integration
- **Automatic data storage** in Google Sheets
- **Real-time record updates**
- **All registration fields captured**

## 📋 Project Structure

```
mocktests/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                      # Environment variables
├── routes/
│   ├── registration.js       # Registration endpoint
│   ├── webhook.js           # Razorpay webhooks
│   └── payment.js           # Payment processing
├── services/
│   ├── registrationService.js # UID generation & processing
│   ├── googleSheetsService.js # Google Sheets integration
│   └── emailService.js      # Email notifications
├── public/
│   ├── index.html           # Registration form
│   └── script.js            # Frontend JavaScript
└── README.md               # This file
```

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Update `.env` file with your credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Razorpay Configuration (Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Gmail Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# Webhook Secret
WEBHOOK_SECRET=your_webhook_secret
```

### 3. Google Sheets Setup
1. Create a Google Sheet with columns: `UUID`, `Name`, `Email`, `Phone`, `Payment ID`, `Registered At`, `DOB`, `Test Status`
2. Share the sheet with your service account email
3. Get the Sheet ID from the URL

### 4. Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `.env`

### 5. Razorpay Setup
1. Create Razorpay account
2. Get API keys from dashboard
3. Set up webhook endpoint: `https://yourdomain.com/webhook/register`

## 🔧 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Visit: `http://localhost:3000`

## 📊 API Endpoints

### Registration
- `POST /api/register` - Direct registration (without payment)
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature

### Webhooks
- `POST /webhook/register` - Razorpay payment webhook
- `POST /webhook/register-direct` - Direct registration webhook

### Utilities
- `GET /health` - Health check endpoint
- `GET /` - Registration form

## 🔄 Complete Flow

```
User fills form → Razorpay payment → Payment success → 
Webhook receives data → Generate UID → Store in Google Sheets → 
Send welcome email → Show success modal with UID
```

## 🔢 UID Generation Logic

```javascript
// Automatic numeric UID generation
const uniqueId = Date.now().toString();
// Example output: "1709123456789"

// Alternative 6-digit format (for testing)
const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
```

## 📧 Email Template Features

- **Professional gradient design**
- **UID prominently displayed**
- **Complete registration details**
- **Important instructions**
- **Call-to-action buttons**

## 🔒 Security Features

- **Webhook signature verification**
- **Input validation and sanitization**
- **Error handling and logging**
- **Environment variable protection**

## 🧪 Testing

### Direct Registration (No Payment)
For testing without actual payment, you can use the direct endpoint:

```javascript
fetch('/webhook/register-direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        dob: '2000-01-01'
    })
});
```

## 🚀 Production Deployment

### Environment Variables Required
- All `.env` variables must be set in production
- Use HTTPS for secure payment processing
- Set up proper firewall rules

### Recommended Hosting
- **Backend**: Railway, Heroku, or AWS
- **Frontend**: Vercel, Netlify (if separated)
- **Database**: Google Sheets (as configured)

## 📞 Support

For issues and support:
- 📧 Email: support@freshdigitalcreations.com
- 🌐 Website: www.freshdigitalcreations.com

---

**Built with ❤️ by Fresh Digital Creations**
