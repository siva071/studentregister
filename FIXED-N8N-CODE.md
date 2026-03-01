# 🔧 **Fixed n8n Webhook Code - Use Frontend UID**

## 📋 **Replace your n8n code node with this:**

```javascript
// Webhook signature verification
const crypto = require('crypto');

const webhookSecret = 'MockTest@2026#SecureRzpKey!991';
const signature = $input.first().json.headers['x-razorpay-signature'];
const body = JSON.stringify($input.first().json);

const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex');

if (expectedSignature !== signature) {
  throw new Error("Invalid webhook signature");
}

// ✅ Signature verified - process data
const paymentData = $input.first().json.body;

console.log('🔍 Full webhook payload:', JSON.stringify(paymentData, null, 2));

// Handle custom webhook from frontend (this is what we're receiving)
if (paymentData.name && paymentData.email && paymentData.paymentId) {
  console.log('🔄 Processing custom webhook from frontend');
  
  // Use UID from frontend if provided, otherwise generate new one
  const uniqueId = paymentData.uid || Date.now().toString();
  
  // Convert DOB from DD/MM/YYYY to YYYY-MM-DD for storage
  let formattedDob = paymentData.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
    }
  }
  
  // Final registration object with payment status
  const finalData = {
    uuid: uniqueId,
    name: paymentData.name,
    email: paymentData.email,
    phone: paymentData.phone || "",
    paymentId: paymentData.paymentId, // Reference number
    paymentStatus: "success", // Payment status
    dob: formattedDob, // Formatted DOB
    registeredAt: new Date().toISOString(),
    testStatus: "registered"
  };
  
  console.log('✅ Custom webhook processed:', finalData);
  
  // Return data for next nodes (Google Sheets, Email, etc.)
  // AND return to frontend
  return [{
    json: finalData
  }];
}

// Handle Razorpay payment link webhooks (backup)
if (paymentData.event === 'payment_link.paid') {
  console.log('🔄 Processing Razorpay payment link webhook');
  
  const paymentLink = paymentData.payload.payment_link.entity;
  const payment = paymentData.payload.payment.entity;
  
  if (!payment || payment.status !== "captured") {
    throw new Error("Payment not captured");
  }
  
  // Generate UID for Razorpay webhook
  const uniqueId = Date.now().toString();
  
  // Convert DOB from DD/MM/YYYY to YYYY-MM-DD for storage
  let formattedDob = paymentLink.customer?.notes?.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
    }
  }
  
  const finalData = {
    uuid: uniqueId,
    name: paymentLink.customer?.name || "Student",
    email: paymentLink.customer?.email || "",
    phone: paymentLink.customer?.contact || "",
    paymentId: payment.id,
    paymentStatus: "success",
    dob: formattedDob,
    registeredAt: new Date().toISOString(),
    testStatus: "registered"
  };
  
  console.log('✅ Razorpay webhook processed:', finalData);
  
  return [{
    json: finalData
  }];
}

// If no matching event type, log the payload for debugging
console.log('❓ Unknown webhook event type, payload:', JSON.stringify(paymentData, null, 2));
return [];
```

## 🎯 **Key Changes:**

1. **Use frontend UID**: `paymentData.uid || Date.now().toString()`
2. **Proper body access**: `$input.first().json.body`
3. **DOB format conversion**: DD/MM/YYYY → YYYY-MM-DD
4. **Payment status tracking**: Added `paymentStatus: "success"`
5. **Handle both sources**: Frontend POST and Razorpay webhook

## 🚀 **How This Fixes the Issue:**

### **Before:**
- Frontend UID: 1772295649784
- n8n UID: 1772295652417 (different!)
- Problem: Different UIDs across systems

### **After:**
- Frontend UID: 1772295649784
- n8n UID: 1772295649784 (same!)
- Solution: Synchronized UIDs

## 📋 **Setup Instructions:**

1. **Copy the code** above
2. **Paste into your n8n code node**
3. **Save and test**
4. **All UIDs will now match!**

---

**This ensures the same UID is used across frontend, Google Sheets, and email!** 🔢✨
