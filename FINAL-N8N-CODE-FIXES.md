# 🔧 **Final n8n Code Fixes**

## 📋 **1. Main Webhook (UID Consistency + Duplicate Prevention)**

### **Replace your n8n Organize Data code with this:**

```javascript
// Handle ONLY Razorpay Webhook
if ($json.payload && $json.payload.payment_link) {

  const paymentLink = $json.payload.payment_link.entity;
  const payment = $json.payload.payment?.entity;

  if (!payment || payment.status !== "captured") {
    throw new Error("Payment not captured");
  }

  // Get UID from Razorpay notes (from frontend)
  const uid = paymentLink.notes?.uid || Date.now().toString();
  
  // Get customer data
  const email = paymentLink.customer?.email || "";
  const phone = paymentLink.customer?.contact || "";
  const name = paymentLink.customer?.name || "Student";
  const dob = paymentLink.notes?.dob || "";

  // Check for duplicates in Google Sheets
  const existingRecord = $json.googleSheetsData?.find(row => 
    row.email === email || row.phone === phone
  );

  if (existingRecord) {
    return [{
      json: {
        error: "Duplicate registration",
        message: "Email or phone already registered",
        existingUid: existingRecord.uuid,
        paymentId: payment.id
      }
    }];
  }

  // Convert DOB from DD/MM/YYYY to YYYY-MM-DD
  let formattedDob = dob;
  if (dob && dob.includes('/')) {
    const parts = dob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  return [{
    json: {
      uuid: uid,  // Same UID from frontend
      name: name,
      email: email,
      phone: phone,
      dob: formattedDob,
      paymentId: payment.id,
      paymentStatus: "success",
      failureReason: "",
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

throw new Error("Invalid webhook source - must be Razorpay webhook");
```

## 📋 **2. Duplicate Check API**

### **Create new n8n workflow: `/api/check-duplicate`**

```javascript
// Webhook trigger: GET /api/check-duplicate
// Method: POST

const email = $json.body.email;
const phone = $json.body.phone;

// Check Google Sheets for existing email or phone
const sheetData = $json.googleSheetsData;

const existingRecord = sheetData.find(row => 
  row.email === email || row.phone === phone
);

if (existingRecord) {
  return [{
    json: {
      exists: true,
      message: "Email or phone already registered",
      existingData: {
        email: existingRecord.email,
        phone: existingRecord.phone,
        registeredAt: existingRecord.registeredAt,
        uuid: existingRecord.uuid
      }
    }
  }];
} else {
  return [{
    json: {
      exists: false,
      message: "No duplicate found"
    }
  }];
}
```

## 📋 **3. Payment Status API**

### **Create new n8n workflow: `/api/payment-status/:paymentId`**

```javascript
// Webhook trigger: GET /api/payment-status/:paymentId
// Method: GET

const paymentId = $json.params.paymentId;

// Check Google Sheets for payment ID
const sheetData = $json.googleSheetsData;

const payment = sheetData.find(row => row.paymentId === paymentId);

if (payment) {
  return [{
    json: {
      success: payment.paymentStatus === "success",
      uuid: payment.uuid,
      status: payment.paymentStatus,
      message: payment.paymentStatus === "success" 
        ? "Payment processed successfully" 
        : "Payment failed"
    }
  }];
} else {
  return [{
    json: {
      success: false,
      error: "Payment not found",
      status: "not_found"
    }
  }];
}
```

## 🎯 **How This Fixes Everything:**

### **✅ UID Consistency:**
- Frontend generates UID: `Date.now().toString()`
- UID stored in Razorpay notes
- n8n extracts UID from notes
- Same UID used everywhere

### **✅ Duplicate Prevention:**
- Frontend checks before payment
- n8n checks before saving
- Prevents duplicate registrations
- Shows clear error messages

### **✅ Payment Status Tracking:**
- API to check payment status
- Frontend can monitor status
- Show success/error accordingly

## 📊 **Expected Results:**

### **✅ Successful Registration:**
```
Frontend: UID = 1709123456789
Razorpay: notes.uid = 1709123456789
n8n: uuid = 1709123456789 (SAME!)
Google Sheets: uuid = 1709123456789
Email: UID = 1709123456789
```

### **❌ Duplicate Prevention:**
```
Frontend: "Email already registered"
n8n: "Duplicate registration" error
No duplicate data saved
```

## 🚀 **Implementation Steps:**

### **Step 1: Update Main Webhook**
- Replace Organize Data code with the new code
- Test with Postman

### **Step 2: Create Duplicate Check API**
- Create new workflow
- Test with frontend

### **Step 3: Create Payment Status API**
- Create new workflow
- Test payment monitoring

---

**This fixes all your issues: UID consistency, duplicate prevention, and payment status tracking!** 🔧✨
