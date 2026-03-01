# 🚨 **ULTIMATE UID FIX - Copy This Exact Code**

## 🔧 **Replace your ENTIRE n8n code node with this:**

```javascript
// Get the webhook body data
const data = $input.first().json.body;

// Check if this is from frontend (has name, email, paymentId)
if (data && data.name && data.email && data.paymentId) {
  
  // USE THE UID FROM FRONTEND - DON'T GENERATE NEW ONE
  const uid = data.uid || Date.now().toString();
  
  // Format DOB if needed
  let formattedDob = data.dob || "";
  if (formattedDob && formattedDob.includes('/')) {
    const parts = formattedDob.split('/');
    if (parts.length === 3) {
      formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  
  // Return the data with SAME UID
  return [{
    json: {
      uuid: uid,                    // SAME UID FROM FRONTEND
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      paymentId: data.paymentId,     // SAME PAYMENT ID
      paymentStatus: "success",
      dob: formattedDob,
      registeredAt: new Date().toISOString(),
      testStatus: "registered"
    }
  }];
}

// If no data, return empty
return [];
```

## ❌ **DELETE YOUR OLD CODE COMPLETELY**

**Remove all this old code:**
- All the `if ($json.payload.payment_link.entity)` stuff
- All the `const paymentLink = $json.payload...` stuff
- All the `const uniqueId = Date.now().toString()` stuff

## ✅ **KEEP ONLY THE NEW CODE ABOVE**

## 🎯 **Why This Fixes It:**

### **Old Code Problem:**
```javascript
const uniqueId = Date.now().toString(); // ALWAYS GENERATES NEW UID
```

### **New Code Solution:**
```javascript
const uid = data.uid || Date.now().toString(); // USE FRONTEND UID
```

## 🚀 **Test Instructions:**

1. **Delete all old code** in your n8n node
2. **Copy-paste the new code** above
3. **Save the n8n workflow**
4. **Test payment again**

## 📊 **Expected Result:**

```
Frontend sends: {uid: "1772295649784", paymentId: "pay_real_1772295649784"}
n8n receives: Same data
n8n returns: {uuid: "1772295649784", paymentId: "pay_real_1772295649784"}
Google Sheets: Same UID and Payment ID
Email: Same UID and Payment ID
```

## 🔍 **Debug Steps:**

If still not working, check:
1. **Frontend is sending UID** (check browser console)
2. **n8n is receiving UID** (check n8n execution logs)
3. **Google Sheets shows same UID** (check sheet)

---

**This is the simplest, most direct fix. Copy this exact code and replace everything!** 🔧✨
