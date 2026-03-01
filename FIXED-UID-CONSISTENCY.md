# 🔧 **Fix UID Consistency Between Frontend and n8n**

## 🎯 **Problem:**
- Frontend generates UID locally
- n8n generates different UID
- User sees wrong UID

## ✅ **Solution: Use Same UID Generation Logic**

### **Frontend UID Generation:**
```javascript
// In script.js - BEFORE payment
const uid = Date.now().toString();
console.log('Generated UID:', uid);

// Store in localStorage for later use
localStorage.setItem('registration_uid', uid);
localStorage.setItem('registration_data', JSON.stringify(formData));
```

### **Pass UID to Razorpay:**
```javascript
// Include UID in Razorpay notes
const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        amount: 1900,
        currency: 'INR',
        receipt: 'receipt_' + uid,
        notes: {
            ...formData,
            uid: uid  // Include UID in notes
        }
    })
});
```

### **n8n Use UID from Razorpay:**
```javascript
// In n8n Organize Data node
const paymentLink = $json.payload.payment_link.entity;
const uid = paymentLink.notes?.uid || Date.now().toString();

// Use the same UID from frontend
const finalData = {
    uuid: uid,  // Same UID as frontend
    name: paymentLink.customer?.name || "Student",
    email: paymentLink.customer?.email || "",
    phone: paymentLink.customer?.contact || "",
    dob: paymentLink.notes?.dob || "",
    paymentId: $json.payload.payment.entity.id,
    paymentStatus: "success",
    registeredAt: new Date().toISOString(),
    testStatus: "registered"
};
```

## 🎯 **Result:**
- Frontend and n8n use same UID
- User sees correct UID
- Data consistency maintained
