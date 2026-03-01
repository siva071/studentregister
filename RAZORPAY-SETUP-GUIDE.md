# 💳 Razorpay Payment Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/signin)
2. Sign up/login with your email
3. Complete KYC (for live payments)

### 2. Get API Keys
1. Go to **Settings → API Keys** 
2. Click **Generate Key**
3. You'll get:
   - **Key ID**: `rzp_test_...` (for testing)
   - **Key Secret**: Keep this secure

### 3. Update Your Website Code

#### A. Update Frontend JavaScript (script.js)
```javascript
// Replace this line with your actual Razorpay Key
key: 'rzp_test_YOUR_ACTUAL_KEY_HERE',
```

#### B. Update Backend (.env file)
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Test Payment Integration

#### Method 1: Test with Test Cards
1. Open your website: `http://localhost:3000`
2. Fill registration form
3. Click "Register & Pay ₹19"
4. Use test card details:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., 12/25)
   - **CVV**: Any 3 digits (e.g., 123)
   - **Name**: Test Name
   - **Email**: test@example.com

#### Method 2: UPI Testing
- **UPI ID**: `test@razorpay`
- **Enter UPI PIN**: `123456`

## 🔧 Complete Implementation Steps

### Step 1: Update script.js with Your Keys
```javascript
// Find this line in public/script.js
const options = {
    key: 'rzp_test_YourKeyHere', // Replace with your Razorpay key
    // ... rest of options
};
```

### Step 2: Update Server Configuration
```javascript
// In routes/payment.js - ensure this uses your keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

### Step 3: Update .env File
```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

## 🎯 Payment Flow Testing

### Complete Test Process:
1. **User fills form** → Name, Email, Phone, DOB
2. **Clicks "Register & Pay ₹19"** → Creates payment order
3. **Razorpay checkout opens** → User selects payment method
4. **Enters test card details** → Uses test credentials
5. **Payment successful** → Data sent to n8n webhook
6. **UID generated** → Email sent with registration details

## 🔍 Testing Checklist

### ✅ Frontend Testing:
- [ ] Form validation works
- [ ] Razorpay checkout opens
- [ ] Test card payment succeeds
- [ ] Success modal shows UID

### ✅ Backend Testing:
- [ ] Payment order created successfully
- [ ] Webhook receives data
- [ ] n8n workflow processes data

### ✅ Integration Testing:
- [ ] Data flows to n8n server
- [ ] UID is generated
- [ ] Google Sheets updated
- [ ] Email sent successfully

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid API Key"
**Solution**: Update both frontend and backend with correct keys

### Issue 2: "Payment Failed"
**Solution**: 
- Check test card details
- Ensure key is in test mode
- Verify network connectivity

### Issue 3: "Webhook Not Receiving Data"
**Solution**:
- Check n8n server is running
- Verify webhook URL is correct
- Check CORS settings

### Issue 4: "Amount Mismatch"
**Solution**: Ensure amount is in paise (₹19 = 1900 paise)

## 📱 Mobile Testing

### Test on Mobile:
1. Open `http://localhost:3000` on mobile browser
2. Test UPI payments (works better on mobile)
3. Verify responsive design

## 🌐 Going Live

### When Ready for Production:
1. **Switch to Live Keys**:
   - Generate live API keys in Razorpay dashboard
   - Update `.env` file with live keys
   - Update frontend with live key ID

2. **Update Webhook URL**:
   - Use HTTPS URL for production
   - Set up proper domain

3. **Security**:
   - Enable webhook signature verification
   - Add rate limiting
   - Implement proper error handling

## 🎉 Success Indicators

### When Everything Works:
- ✅ Payment modal opens smoothly
- ✅ Test payments succeed
- ✅ User receives success message
- ✅ Data appears in your n8n workflow
- ✅ Email is sent with UID
- ✅ Google Sheets is updated

## 📞 Support

### Razorpay Support:
- **Documentation**: https://razorpay.com/docs/
- **Test Cards**: https://razorpay.com/docs/payment-gateway/test-card-details/

### Your System Support:
- Check browser console for errors
- Verify n8n execution history
- Test with different payment methods

---

**Ready to start accepting payments! 🚀**
