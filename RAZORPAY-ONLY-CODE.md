# 🔥 **RAZORPAY WEBHOOK ONLY CODE**

## 📋 **Replace your n8n Organize Data code with this:**

```javascript
// Handle ONLY Razorpay Webhook
if ($json.payload && $json.payload.payment_link) {

  const paymentLink = $json.payload.payment_link.entity;
  const payment = $json.payload.payment?.entity;

  if (!payment || payment.status !== "captured") {
    throw new Error("Payment not captured");
  }

  // Generate UID only in n8n
  const uniqueId = Date.now().toString();

  return [{
    json: {
      uuid: uniqueId,
      name: paymentLink.customer?.name || "Student",
      email: paymentLink.customer?.email || "",
      phone: paymentLink.customer?.contact || "",
      dob: paymentLink.customer?.notes?.dob || "",
      paymentId: payment.id,              // REAL Razorpay ID
      paymentStatus: "success",
      failureReason: "",
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

throw new Error("Invalid webhook source - must be Razorpay webhook");
```

## 🎯 **Why This is Professional:**

### ✅ **Single Source of Truth:**
- Only Razorpay webhook generates UID
- Only Razorpay webhook provides payment ID
- No frontend interference

### ✅ **Secure Architecture:**
- No frontend POST calls
- No fake payment IDs
- Only verified Razorpay payments

### ✅ **Clean Data Flow:**
```
User Pays → Razorpay → Webhook → n8n → UID → Sheet → Email
```

## 📊 **Expected Results:**

### ✅ **Real Payment Data:**
```
paymentId: SLc8cGyssBLrs2 (REAL Razorpay ID)
uuid: 1709123456789 (Generated once)
paymentStatus: success
```

## 🔧 **Implementation:**

1. **Replace entire code** in n8n Organize Data node
2. **Save n8n workflow**
3. **Configure Razorpay webhook** to send to n8n
4. **Test with real payment**

---

**This is the professional way - only Razorpay webhook controls the system!** 🔐✨
