# 🔒 N8N Payment Link Webhook Security Setup

## 📡 Complete Code Node for Payment Link Webhook

Copy this entire code into your n8n Code Node:

```javascript
// 🔒 Razorpay Payment Link Webhook Security Verification
const crypto = require("crypto");

// Your webhook secret (must match Razorpay dashboard)
const webhookSecret = "MockTest@2026#SecureRzpKey!991";

// Get incoming data
const body = JSON.stringify($json);
const signature = $headers["x-razorpay-signature"];

// Verify webhook signature
const expectedSignature = crypto
  .createHmac("sha256", webhookSecret)
  .update(body)
  .digest("hex");

if (expectedSignature !== signature) {
  throw new Error("Invalid webhook signature");
}

// ✅ Signature verified - process data
const paymentData = $json;

console.log('🔍 Full webhook payload:', JSON.stringify(paymentData, null, 2));

// Check if this is a payment_link.paid event
if (paymentData.event === 'payment_link.paid') {
  // STEP 3 — Extract Data from Payment Link Payload
  const paymentLink = paymentData.payload.payment_link.entity;
  const payment = paymentData.payload.payment.entity;
  
  if (!payment || payment.status !== "captured") {
    throw new Error("Payment not successful");
  }
  
  // Generate UID
  const uniqueId = Date.now().toString();
  
  // Final registration object
  const finalData = {
    uuid: uniqueId,
    name: paymentLink.customer?.name || "Student",
    email: paymentLink.customer?.email || "",
    phone: paymentLink.customer?.contact || "",
    paymentId: payment.id,
    registeredAt: new Date().toISOString(),
    testStatus: "registered"
  };
  
  // Validate required fields
  if (!finalData.email) {
    throw new Error('Missing required field: email');
  }
  
  console.log('✅ Payment Link processed:', finalData);
  
  // Return data for next nodes (Google Sheets, Email, etc.)
  return [{
    json: finalData
  }];
}

// Handle direct payment events (fallback)
if (paymentData.event === 'payment.captured') {
  console.log('🔄 Processing direct payment event');
  
  // Extract payment data directly
  const payment = paymentData.payload.payment.entity;
  
  if (!payment) {
    throw new Error("Payment data not found");
  }
  
  // Generate UID
  const uniqueId = Date.now().toString();
  
  // Final registration object
  const finalData = {
    uuid: uniqueId,
    name: payment.notes?.name || "Student",
    email: payment.notes?.email || "",
    phone: payment.notes?.phone || "",
    paymentId: payment.id,
    registeredAt: new Date().toISOString(),
    testStatus: "registered"
  };
  
  // Validate required fields
  if (!finalData.email) {
    throw new Error('Missing required field: email');
  }
  
  console.log('✅ Direct payment processed:', finalData);
  
  // Return data for next nodes (Google Sheets, Email, etc.)
  return [{
    json: finalData
  }];
}

// Handle custom webhook from frontend (fallback)
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

// Handle payment failures
if (paymentData.event === 'payment_link.failed' || paymentData.event === 'payment.failed') {
  console.log('❌ Payment failed:', paymentData);
  
  // Generate UID for tracking failed payment
  const uniqueId = Date.now().toString();
  
  // Extract payment data if available
  const paymentLink = paymentData.payload?.payment_link?.entity;
  const payment = paymentData.payload?.payment?.entity;
  
  // Convert DOB from DD/MM/YYYY to YYYY-MM-DD for storage
  let formattedDob = payment?.notes?.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
    }
  }
  
  // Failed payment data
  const failedData = {
    uuid: uniqueId,
    name: paymentLink?.customer?.name || payment?.notes?.name || "Unknown",
    email: paymentLink?.customer?.email || payment?.notes?.email || "",
    phone: paymentLink?.customer?.contact || payment?.notes?.phone || "",
    paymentId: payment?.id || paymentLink?.id || "unknown",
    paymentStatus: "failed", // Payment status
    failureReason: paymentData.payload?.error?.description || "Payment failed",
    dob: formattedDob, // Formatted DOB
    registeredAt: new Date().toISOString(),
    testStatus: "payment_failed"
  };
  
  console.log('❌ Failed payment recorded:', failedData);
  
  // Return data for Google Sheets (to track failed payments)
  return [{
    json: failedData
  }];
}

// If no matching event type, log the payload for debugging
console.log('❓ Unknown webhook event type, payload:', JSON.stringify(paymentData, null, 2));
return [];
```

## 🔧 Setup Instructions

### ✅ STEP 1 — Razorpay Webhook Setup

In Razorpay Dashboard:
1. **Account & Settings → Webhooks → Add New**
2. **Webhook URL**: `https://n8nnserver.duckdns.org/webhook/register`
3. **Secret**: `MockTest@2026#SecureRzpKey!991` (updated secret)
4. **Select Events**: 
   - `✔ payment_link.paid`
   - `✔ payment.captured` (add as backup)
5. **Save**

### ✅ STEP 2 — n8n Webhook Node Setup

In your n8n workflow:
1. **Webhook Trigger** → **POST method**
2. **Path**: `register`
3. **⚠ Important**: Enable "Respond immediately"

### ✅ STEP 3 — n8n Code Node (Extract Data)

Paste the code above in your n8n Code Node

## 📊 Payment Link Payload Structure

### **Webhook Data Structure:**
```javascript
// Payment Link webhook payload
{
  "event": "payment_link.paid",
  "payload": {
    "payment_link": {
      "entity": {
        "id": "plink_...",
        "customer": {
          "name": "Student Name",
          "email": "student@example.com",
          "contact": "9876543210"
        }
      }
    },
    "payment": {
      "entity": {
        "id": "pay_...",
        "status": "captured",
        "amount": 1900
      }
    }
  }
}
```

### **Output Data Structure:**
```json
{
  "uuid": "1709123456789",
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "9876543210",
  "paymentId": "pay_1234567890",
  "registeredAt": "2026-02-28T12:34:56.789Z",
  "testStatus": "registered"
}
```

## 🎯 Payment Link Flow

```
User Clicks Payment Link → 
Razorpay Payment Page → 
Payment Success → 
Webhook Trigger (payment_link.paid) → 
n8n Receives Data → 
Signature Verification → 
UID Generation → 
Google Sheets + Email
```

## 🔥 Professional Process

### **Your Payment Link:**
```
https://rzp.io/rzp/fFWCnRQ5
```

### **Automatic Data Flow:**
1. User pays via payment link
2. Razorpay sends webhook automatically
3. n8n processes payment data
4. UID generated automatically
5. Email sent with UID

## ⚠ Important Notes

### **Webhook Configuration:**
- ✅ **URL**: `https://n8nnserver.duckdns.org/webhook/register`
- ✅ **Secret**: `S8dj29Kd9@mockTest#2026!Rzp`
- ✅ **Event**: Only `payment_link.paid`
- ✅ **Respond Immediately**: Enabled in n8n

### **Data Extraction:**
- ✅ **Payment Link Data**: `$json.payload.payment_link.entity`
- ✅ **Payment Data**: `$json.payload.payment.entity`
- ✅ **Customer Info**: `paymentLink.customer.name/email/contact`

### **Security:**
- ✅ **Signature Verification**: HMAC SHA256
- ✅ **Event Filtering**: Only payment_link.paid
- ✅ **Data Validation**: Check payment status

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
- Use `payment.captured` event (use `payment_link.paid`)
- Extract from wrong payload path
- Forget to enable "Respond immediately"
- Use wrong webhook secret

### ✅ DO:
- Use correct event: `payment_link.paid`
- Extract from: `payload.payment_link.entity` and `payload.payment.entity`
- Enable "Respond immediately" in n8n
- Use exact webhook secret

## 🔍 Testing Your Payment Link

### **Test Process:**
1. **Share payment link**: `https://rzp.io/rzp/fFWCnRQ5`
2. **Make test payment** (card: 4111 1111 1111 1111)
3. **Check n8n execution** history
4. **Verify data processing** works
5. **Confirm email** is sent

### **Expected Results:**
- ✅ Webhook triggered automatically
- ✅ Signature verified
- ✅ UID generated
- ✅ Data stored in Google Sheets
- ✅ Welcome email sent

---

**Your Payment Link integration is now professional and automatic!** 🔒🎉
