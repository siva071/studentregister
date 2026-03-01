# 🔥 **SYNCHRONIZED N8N CODE - Same UID as Frontend**

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

  // Generate UID for Razorpay webhook
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

// Handle backup data from frontend (fallback method) - USE FRONTEND UID
if (inputData.body && inputData.body.name && inputData.body.email) {
  
  const data = inputData.body;
  
  // ✅ USE UID FROM FRONTEND - DON'T GENERATE NEW ONE
  const uniqueId = data.uid || Date.now().toString();
  
  // Convert DOB format if needed
  let formattedDob = data.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  console.log('✅ Backup data processed with FRONTEND UID:', {
    uuid: uniqueId,
    paymentId: data.paymentId,
    name: data.name
  });

  return [{
    json: {
      uuid: uniqueId,                    // ✅ SAME UID FROM FRONTEND
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      dob: formattedDob,
      paymentId: data.paymentId,          // ✅ SAME PAYMENT ID FROM FRONTEND
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

## 🎯 **Key Fix:**

### **❌ Before (Different UIDs):**
```javascript
// Frontend generates: 1709123456789
// n8n generates: 1709123456790 (different!)
```

### **✅ After (Same UIDs):**
```javascript
// Frontend generates: 1709123456789
// n8n uses: 1709123456789 (SAME!)
```

## 📊 **Expected Result:**

### **✅ Perfect Synchronization:**
```
Frontend: UID 1709123456789, paymentId backup_1709123456789
n8n: UID 1709123456789, paymentId backup_1709123456789
Google Sheets: 1709123456789 | backup_1709123456789
All exactly the same! ✅
```

## 🔧 **Implementation:**

### **Step 1: Update n8n**
1. **Delete all old code** in n8n node
2. **Paste the synchronized code** above
3. **Save n8n workflow**

### **Step 2: Test Frontend**
1. **Hard refresh browser** (`Ctrl + Shift + R`)
2. **Fill form and click "Register & Pay"**
3. **Check console logs**:
   ```
   🔢 Generated UID for backup: 1709123456789
   💳 Generated payment ID for backup: backup_1709123456789
   ✅ Backup data sent to n8n with UID: 1709123456789
   ```

### **Step 3: Check n8n**
1. **Go to n8n executions**
2. **Should see**: `✅ Backup data processed with FRONTEND UID: 1709123456789`

### **Step 4: Check Google Sheets**
1. **Should see**: Same UID and payment ID as frontend

## 🎊 **Perfect Match:**

### **✅ All Systems Synchronized:**
- **Frontend**: 1709123456789 | backup_1709123456789
- **n8n**: 1709123456789 | backup_1709123456789  
- **Google Sheets**: 1709123456789 | backup_1709123456789

---

**Now frontend and n8n will have exactly the same UID and payment ID!** 🔢✨
