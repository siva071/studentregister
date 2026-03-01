# 🔥 **FINAL HYBRID CODE - Handle Both Sources**

## 📋 **Replace your n8n Organize Data code with this:**

```javascript
// Handle Razorpay Webhook (Primary Method)
if ($json.payload && $json.payload.payment_link) {

  const paymentLink = $json.payload.payment_link.entity;
  const payment = $json.payload.payment?.entity;

  const uniqueId = Date.now().toString();

  // If Payment Success
  if (payment && payment.status === "captured") {

    return [{
      json: {
        uuid: uniqueId,
        name: paymentLink.customer?.name || "Student",
        email: paymentLink.customer?.email || "",
        phone: paymentLink.customer?.contact || "",
        paymentId: payment.id,
        paymentStatus: "success",
        failureReason: "",
        dob: "",
        registeredAt: new Date().toISOString(),
        testStatus: "registered"
      }
    }];
  }

  // If Payment Failed
  return [{
    json: {
      uuid: uniqueId,
      name: paymentLink.customer?.name || "Student",
      email: paymentLink.customer?.email || "",
      phone: paymentLink.customer?.contact || "",
      paymentId: payment?.id || "",
      paymentStatus: "failed",
      failureReason: payment?.error_description || "Payment not captured",
      dob: "",
      registeredAt: new Date().toISOString(),
      testStatus: "not_registered"
    }
  }];
}

// Handle Frontend POST (Fallback Method)
if ($json.body && $json.body.name && $json.body.email && $json.body.paymentId) {

  // ✅ USE UID FROM FRONTEND - DON'T GENERATE NEW ONE
  const uniqueId = $json.body.uid || Date.now().toString();

  return [{
    json: {
      uuid: uniqueId,
      name: $json.body.name,
      email: $json.body.email,
      phone: $json.body.phone || "",
      dob: $json.body.dob || "",
      paymentId: $json.body.paymentId,
      paymentStatus: "success",
      failureReason: "",
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

throw new Error("Invalid data source");
```

## 🎯 **Why This Works:**

### **✅ Handles Both Sources:**
1. **Razorpay Webhook**: `$json.payload.payment_link`
2. **Frontend POST**: `$json.body.name && $json.body.email`

### **✅ Uses Frontend UID:**
```javascript
const uniqueId = $json.body.uid || Date.now().toString();
```
If frontend sends UID, use it. Otherwise generate new one.

### **✅ No More Errors:**
- Razorpay webhook → Works
- Frontend POST → Works
- No "Invalid webhook source" error

## 📊 **Expected Results:**

### **✅ Frontend POST (Current):**
```
Input: {uid: "1772296798662", paymentId: "backup_1772296798662"}
Output: {uuid: "1772296798662", paymentId: "backup_1772296798662"}
```

### **✅ Razorpay Webhook (Future):**
```
Input: {payload: {payment_link: {...}, payment: {...}}}
Output: {uuid: "1709123456789", paymentId: "SLc8cGyssBLrs2"}
```

## 🔧 **Implementation:**

1. **Replace entire code** in n8n Organize Data node
2. **Save n8n workflow**
3. **Test frontend** - Should work now
4. **Test Razorpay webhook** when ready

## 🎊 **Benefits:**

### ✅ **Flexible Architecture:**
- Works with current frontend POST
- Ready for Razorpay webhook
- UID synchronization maintained

### ✅ **Professional Setup:**
- No errors
- Clean data flow
- Scalable for future

---

**This hybrid code handles both your current frontend POST and future Razorpay webhook!** 🔧✨
