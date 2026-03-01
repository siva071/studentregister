# Fixed n8n Webhook Code - Return UID to Frontend

## 🔧 **Replace your n8n code node with this:**

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
  
  // Generate UID
  const uniqueId = Date.now().toString();
  
  // Final registration object
  const finalData = {
    uuid: uniqueId,
    name: paymentData.name,
    email: paymentData.email,
    phone: paymentData.phone || "",
    paymentId: paymentData.paymentId,
    dob: paymentData.dob || "",
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

// If no matching event type, log the payload for debugging
console.log('❓ Unknown webhook event type, payload:', JSON.stringify(paymentData, null, 2));
return [];
```

## 🎯 **Key Changes:**

1. **Use `$input.first().json.body`** instead of `$json`
2. **Return the same data** to both n8n nodes AND frontend
3. **Consistent UID generation** - same UID for all systems

## 🔄 **How This Fixes the Issue:**

### **Before:**
- Website UID: 1772292853747 (local)
- n8n UID: 1772293732558 (different)
- Email/Sheets: 1772293732558

### **After:**
- Website UID: 1772293732558 (from n8n)
- n8n UID: 1772293732558 (same)
- Email/Sheets: 1772293732558 (same)

## 🚀 **Setup Instructions:**

1. **Copy the code above**
2. **Paste into your n8n code node**
3. **Save and test**
4. **All UIDs will now match!**

---

**This ensures the same UID is shown on website, Google Sheets, and email!** ✨
