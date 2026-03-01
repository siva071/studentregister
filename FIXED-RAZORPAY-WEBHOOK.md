# 🔧 **Fixed Razorpay Webhook - Use Customer Email**

## 🎯 **Problem Identified:**

### **❌ Current Issue:**
- **Webhook gets**: `email: empty`
- **Should get**: `sivashankar05291@gmail.com`
- **Email node fails**: "Invalid email address"
- **Registration stops**: Due to email validation

## ✅ **Solution:**

### **🔧 Updated n8n Code:**

```javascript
// Handle ONLY Razorpay Webhook
if ($json.body && $json.body.payload && $json.body.payload.payment_link) {

  const paymentLink = $json.body.payload.payment_link.entity;
  const payment = $json.body.payload.payment.entity;

  if (!payment || payment.status !== "captured") {
    throw new Error("Payment not captured");
  }

  // Get customer data from Razorpay payment link
  const customerName = paymentLink.customer?.name || "Student";
  const customerEmail = paymentLink.customer?.email || "";
  const customerPhone = paymentLink.customer?.contact || "";
  const customerDob = paymentLink.notes?.dob || "";

  // Get UID from Razorpay notes (from frontend)
  const uniqueId = paymentLink.notes?.uid || Date.now().toString();

  // Convert DOB from DD/MM/YYYY to YYYY-MM-DD
  let formattedDob = customerDob;
  if (customerDob && customerDob.includes('/')) {
    const parts = customerDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  return [{
    json: {
      uuid: uniqueId,
      name: customerName,
      email: customerEmail,  // Use Razorpay customer email
      phone: customerPhone,  // Use Razorpay customer phone
      paymentId: payment.id,
      paymentStatus: "success",
      failureReason: "",
      dob: formattedDob,
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

throw new Error("Invalid webhook source - must be Razorpay webhook");
```

## 📋 **Key Changes:**

### **✅ Customer Data Usage:**
```javascript
// BEFORE: Using empty customer data
email: "",
phone: "",
name: "Student"

// AFTER: Using Razorpay customer data
email: paymentLink.customer?.email || "",
phone: paymentLink.customer?.contact || "",
name: paymentLink.customer?.name || "Student"
```

### **✅ UID from Frontend:**
```javascript
// Use UID from Razorpay notes (sent from frontend)
const uniqueId = paymentLink.notes?.uid || Date.now().toString();
```

## 🎯 **How This Fixes Your Issue:**

### **✅ Email Flow:**
1. **Frontend**: User enters `sivashankar05291@gmail.com`
2. **Razorpay**: Creates payment link with customer email
3. **Webhook**: Receives customer email from Razorpay
4. **n8n**: Uses customer email (not empty)
5. **Email node**: Gets valid email address
6. **Success**: Email sends successfully

### **✅ Data Consistency:**
- **Frontend UID**: Used in Razorpay notes
- **n8n UID**: Same from Razorpay notes
- **Customer data**: From Razorpay (not empty)
- **All systems**: Use same data

## 🔧 **Implementation Steps:**

### **Step 1: Update n8n Webhook**
1. **Replace** your current webhook code
2. **Use customer data** from `paymentLink.customer`
3. **Use UID** from `paymentLink.notes.uid`
4. **Test** with your payment data

### **Step 2: Test the Flow**
1. **Submit form** with your email
2. **Complete payment** on Razorpay
3. **Check webhook** execution
4. **Verify email** sends successfully

## 📊 **Expected Result:**

### **✅ Webhook Output:**
```json
{
  "uuid": "1772338504457",
  "name": "Siva Shankar",
  "email": "sivashankar05291@gmail.com",  // From Razorpay
  "phone": "+916304354565",           // From Razorpay
  "paymentId": "pay_SLp5rpEnGiBo54",
  "paymentStatus": "success",
  "dob": "2004-05-29",
  "registeredAt": "2026-03-01T04:15:04.457Z",
  "testStatus": "registered"
}
```

---

**Perfect! Now the webhook will use the actual customer email from Razorpay instead of empty!** 🔧✨

Your email `sivashankar05291@gmail.com` will now be processed correctly! 🚀
