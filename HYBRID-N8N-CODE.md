# 🔧 **HYBRID N8N CODE - Handle Both Webhook & Backup**

## 📋 **Replace your n8n code with this:**

```javascript
// Get the input data
const inputData = $input.first().json;

// Handle Razorpay webhook (primary method)
if (inputData.payload && inputData.payload.payment_link) {
  
  const paymentLink = inputData.payload.payment_link.entity;
  const payment = inputData.payload.payment.entity;

  if (!payment || payment.status !== "captured") {
    throw new Error("Payment not captured");
  }

  // Generate UID
  const uniqueId = Date.now().toString();
  
  // Convert DOB format if needed
  let formattedDob = paymentLink.customer?.notes?.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  console.log('✅ Razorpay webhook processed:', {
    uuid: uniqueId,
    paymentId: payment.id,
    name: paymentLink.customer?.name
  });

  return [{
    json: {
      uuid: uniqueId,
      name: paymentLink.customer?.name || "Student",
      email: paymentLink.customer?.email || "",
      phone: paymentLink.customer?.contact || "",
      dob: formattedDob,
      paymentId: payment.id,              // Real Razorpay ID
      paymentStatus: "success",
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

// Handle backup data from frontend (fallback method)
if (inputData.body && inputData.body.name && inputData.body.email) {
  
  const data = inputData.body;
  
  // Use UID from frontend if provided
  const uniqueId = data.uid || Date.now().toString();
  
  // Convert DOB format if needed
  let formattedDob = data.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  console.log('✅ Backup data processed:', {
    uuid: uniqueId,
    paymentId: data.paymentId,
    name: data.name
  });

  return [{
    json: {
      uuid: uniqueId,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      dob: formattedDob,
      paymentId: data.paymentId,          // Backup payment ID
      paymentStatus: "success",
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

// If no matching data source
console.log('❓ Unknown data format:', JSON.stringify(inputData, null, 2));
return [];
```

## 🎯 **How This Works:**

### **✅ Primary Method (Razorpay Webhook):**
- User pays on Razorpay
- Razorpay sends webhook
- n8n processes with real payment ID
- Google Sheets gets real data

### **✅ Backup Method (Frontend POST):**
- Frontend sends backup data
- n8n processes with backup payment ID
- Google Sheets gets backup data
- Ensures no data loss

## 📊 **Expected Results:**

### **If Razorpay Webhook Works:**
```
paymentId: SLc8cGyssBLrs2 (Real Razorpay ID)
uuid: 1709123456789
name: Customer Name
```

### **If Only Backup Works:**
```
paymentId: backup_1709123456789 (Backup ID)
uuid: 1709123456789
name: Customer Name
```

## 🔧 **Setup Instructions:**

### **Step 1: Update n8n**
1. **Delete all old code** in n8n node
2. **Paste the hybrid code** above
3. **Save n8n workflow**

### **Step 2: Test Both Methods**
1. **Test backup**: Fill form → Check console for "✅ Backup data sent"
2. **Test webhook**: Complete payment → Check n8n executions

### **Step 3: Check Google Sheets**
- Should receive data from either method
- No data loss guaranteed

---

**This hybrid approach ensures data always gets to n8n!** 🔧✨
