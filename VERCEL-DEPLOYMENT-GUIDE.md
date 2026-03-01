# 🚀 Vercel Deployment Guide

## 📋 Files Created for Vercel Deployment

I've created the necessary files for Vercel deployment:

### **1. vercel.json**
```json
{
  "version": 2,
  "name": "mock-test-registration",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### **2. API Functions Created**
- `api/register.js` - Registration endpoint
- `api/payment.js` - Payment processing
- `api/webhook.js` - Razorpay webhook

## 🔧 Deployment Steps

### **Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy**
```bash
vercel --prod
```

### **Step 4: Set Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----"
```

## 🎯 Alternative: GitHub Integration

### **Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/yourusername/mock-test-registration.git
git push -u origin main
```

### **Step 2: Connect Vercel to GitHub**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub
4. Set environment variables
5. Deploy

## 🔄 Updated Frontend URLs

After deployment, update these URLs in `public/script.js`:

### **Current (Local):**
```javascript
fetch('/api/create-order', ...)
fetch('https://n8nnserver.duckdns.org/webhook/register', ...)
```

### **After Vercel Deployment:**
```javascript
fetch('/api/payment/create-order', ...)  // Will work automatically
fetch('https://your-vercel-app.vercel.app/webhook/register', ...)
```

## 🌐 Deployment URLs

### **After Deployment:**
- **Main App**: `https://your-app-name.vercel.app`
- **API Endpoints**: `https://your-app-name.vercel.app/api/*`
- **Webhook**: `https://your-app-name.vercel.app/webhook/register`

## 🔧 What Needs to Be Updated

### **1. Razorpay Webhook URL**
Update in Razorpay Dashboard:
```
From: https://n8nnserver.duckdns.org/webhook/register
To: https://your-app-name.vercel.app/webhook/register
```

### **2. Frontend Script (if needed)**
If using direct webhook calls, update:
```javascript
fetch('https://your-app-name.vercel.app/webhook/register', ...)
```

## 📊 Deployment Structure

```
your-project/
├── api/
│   ├── register.js      # Registration endpoint
│   ├── payment.js       # Payment processing
│   └── webhook.js       # Razorpay webhook
├── public/
│   ├── index.html       # Frontend form
│   └── script.js        # Frontend logic
├── services/
│   ├── registrationService.js
│   ├── googleSheetsService.js
│   └── emailService.js
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## 🚨 Important Notes

### **Environment Variables:**
- Must be set in Vercel Dashboard
- Not stored in code for security
- Different for production vs development

### **Webhook Security:**
- Update webhook URL in Razorpay
- Keep the same secret
- Test webhook after deployment

### **Static Files:**
- `public/` folder serves static files
- `index.html` is the main page
- All assets should be in `public/`

## ✅ Pre-Deployment Checklist

- [ ] Get Razorpay API keys
- [ ] Set up Google Sheets integration
- [ ] Configure Gmail credentials
- [ ] Test locally first
- [ ] Push to GitHub (optional)
- [ ] Set Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Update Razorpay webhook URL
- [ ] Test payment flow

## 🎉 After Deployment

1. **Test the live app** at your Vercel URL
2. **Verify payment processing** works
3. **Check webhook delivery** in Razorpay dashboard
4. **Confirm emails are sent**
5. **Monitor Google Sheets updates**

---

**Ready to deploy to Vercel!** 🚀
