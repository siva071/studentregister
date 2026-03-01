# 🔧 **Webhook Troubleshooting - Data Not Coming to n8n**

## 🚨 **Check These Steps:**

### **Step 1: Verify Razorpay Webhook Configuration**

#### **In Razorpay Dashboard:**
1. **Go to**: Account & Settings → Webhooks
2. **Check Webhook URL**: `https://n8nnserver.duckdns.org/webhook/register`
3. **Check Secret**: `MockTest@2026#SecureRzpKey!991`
4. **Check Events**: 
   - ✅ `payment_link.paid` should be enabled
   - ✅ `payment.captured` should be enabled

### **Step 2: Test Webhook Connection**

#### **Test with curl:**
```bash
curl -X POST https://n8nnserver.duckdns.org/webhook/register \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test" \
  -d '{
    "event": "payment_link.paid",
    "payload": {
      "payment_link": {
        "entity": {
          "id": "pl_test_123",
          "customer": {
            "name": "Test User",
            "email": "test@example.com",
            "contact": "1234567890",
            "notes": {
              "dob": "01/01/2000"
            }
          }
        }
      },
      "payment": {
        "entity": {
          "id": "pay_test_123",
          "status": "captured"
        }
      }
    }
  }'
```

### **Step 3: Check n8n Workflow**

#### **In n8n:**
1. **Webhook Trigger** should be:
   - Method: `POST`
   - Path: `register`
   - Authentication: `None`
   - ✅ "Respond immediately" should be enabled

2. **Code Node** should have:
   - The professional code from `FINAL-PROFESSIONAL-N8N.md`
   - No syntax errors

### **Step 4: Check Payment Link Settings**

#### **In Razorpay Payment Link:**
1. **Go to**: Payment Links → Your Link
2. **Edit Settings** → Add customer notes:
   - `name`: {{customer_name}}
   - `email`: {{customer_email}}
   - `phone`: {{customer_phone}}
   - `dob`: {{customer_dob}}

3. **Webhook Configuration**:
   - Webhook URL: `https://n8nnserver.duckdns.org/webhook/register`
   - Events: `payment_link.paid`

### **Step 5: Alternative - Add Frontend POST Backup**

#### **If webhook still not working, add this backup:**

```javascript
// In script.js, add backup POST
async function sendBackupToN8n(formData) {
  try {
    console.log('🔄 Sending backup data to n8n...');
    
    const response = await fetch('https://n8nnserver.duckdns.org/webhook/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        paymentId: 'backup_' + Date.now().toString(),
        uid: Date.now().toString()
      })
    });
    
    if (response.ok) {
      console.log('✅ Backup data sent to n8n');
    } else {
      console.log('❌ Backup failed');
    }
  } catch (error) {
    console.log('❌ Backup error:', error.message);
  }
}

// Call this before redirecting to Razorpay
await sendBackupToN8n(formData);
window.location.href = 'https://rzp.io/rzp/fFWCnRQ5';
```

## 🔍 **Debug Steps:**

### **Check n8n Execution History:**
1. **Go to n8n** → Executions
2. **Look for recent executions**
3. **Check if webhook was triggered**
4. **Check error messages**

### **Check Razorpay Webhook Logs:**
1. **Go to Razorpay Dashboard** → Webhooks
2. **Click on your webhook**
3. **Check "Recent Deliveries"**
4. **See if requests were sent**

### **Check Browser Network:**
1. **Open browser dev tools** → Network
2. **Submit form**
3. **See if any requests go to n8n**

## 🚀 **Quick Fix Test:**

### **Test with Manual Webhook:**
1. **Use Postman** or curl to test webhook
2. **Send test data** to n8n
3. **Check if n8n receives it**
4. **Check if Google Sheets gets data**

---

**Follow these steps to get data flowing to n8n!** 🔧✨
