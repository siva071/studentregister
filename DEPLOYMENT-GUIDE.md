# 🚀 **Deployment Guide - RRB NTPC Mock Test Platform**

## 📋 **Pre-Deployment Cleanup**

### **✅ Files to Delete from GitHub:**
```bash
# Test files to remove before deployment
rm test-webhook.ps1
rm index-simple.html
rm 1-RUPEE-TEST-GUIDE.md
rm DIRECT-TEST-PAYMENT-GUIDE.md
rm FINAL-N8N-CODE-FIXES.md
rm FIXED-RAZORPAY-WEBHOOK.md
rm DUPLICATE-PREVENTION.md
rm FIXED-UID-CONSISTENCY.md
rm 1-RUPEE-TEST-GUIDE.md
rm N8N-PAYMENT-STATUS-API.md
rm POSTMAN-TEST-GUIDE.md
rm WEBHOOK-TROUBLESHOOT.md
rm WEBHOOK-DEBUG-STEPS.md
rm package-lock.json (if exists)
```

## 🎯 **Deployment Steps**

### **✅ Step 1: Prepare Repository**
```bash
# 1. Remove test files (already done above)
# 2. Ensure only production files are present
git status
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### **✅ Step 2: Frontend Deployment**
```bash
# Option 1: Vercel (Recommended)
vercel --prod

# Option 2: Netlify
netlify deploy --prod --dir=public

# Option 3: GitHub Pages
gh-pages --dist=public
```

### **✅ Step 3: Backend Deployment**
```bash
# Option 1: Railway (Recommended)
railway up

# Option 2: DigitalOcean App Platform
# Create Dockerfile and deploy

# Option 3: AWS EC2
# Configure server and deploy
```

## 🔧 **Environment Variables**

### **✅ Frontend (.env):**
```bash
# Create .env.production file
NEXT_PUBLIC_API_URL=https://your-n8n-domain.com
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

### **✅ Backend (n8n):**
```bash
# Update n8n environment variables
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
GOOGLE_SHEETS_CREDENTIALS=your_credentials
GMAIL_APP_PASSWORD=your_app_password
```

## 📊 **Production URLs**

### **✅ Update URLs:**
- **Frontend**: `https://your-domain.com`
- **Razorpay Webhook**: `https://your-n8n-domain.com/webhook/register`
- **Payment Status API**: `https://your-n8n-domain.com/api/payment-status/:paymentId`
- **Previous Registration API**: `https://your-n8n-domain.com/api/previous-registration/:uid`

## 🔍 **Pre-Deployment Testing**

### **✅ Test Production Flow:**
1. **Test registration** with real Razorpay payment (₹1)
2. **Verify webhook** receives data correctly
3. **Check email delivery** works properly
4. **Test duplicate prevention** works
5. **Verify UID consistency** across systems
6. **Test error handling** shows proper messages

## 🚨 **Important Notes**

### **✅ Security:**
- **Remove test payment links** from production
- **Update webhook secrets** before deployment
- **Use production Razorpay keys**
- **Enable HTTPS** on all endpoints
- **Test CORS** configuration

### **✅ Performance:**
- **Enable caching** for static assets
- **Optimize images** before deployment
- **Minimize CSS/JS** files
- **Use CDN** for faster loading

## 📱 **Support & Monitoring**

### **✅ After Deployment:**
- **Monitor logs** for errors
- **Track payments** in real-time
- **Test webhook failures** have retry logic
- **User feedback** collection system
- **Regular backups** of database

---

**Ready to deploy! 🚀 Follow this guide for smooth production launch!**
