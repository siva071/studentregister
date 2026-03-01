# 🔧 **Postman Webhook Test Guide**

## 📋 **Setup Instructions:**

### **1. Import Collection**
1. **Open Postman**
2. **Click "Import"**
3. **Select the JSON file** (if you have it)
4. **Or create manually below**

### **2. Create Request Manually**

#### **Request 1: Test Successful Payment**
```
Method: POST
URL: https://n8nnserver.duckdns.org/webhook/register

Headers:
Content-Type: application/json
x-razorpay-signature: test_signature_123

Body (raw JSON):
{
  "event": "payment_link.paid",
  "payload": {
    "payment_link": {
      "entity": {
        "customer": {
          "name": "Test Student",
          "email": "student@test.com",
          "contact": "+919876543210"
        },
        "notes": {
          "dob": "15/08/2000"
        }
      }
    },
    "payment": {
      "entity": {
        "id": "pay_SLc8cGyssBLrs2",
        "status": "captured",
        "amount": 1900,
        "currency": "INR",
        "created_at": 1709123456
      }
    }
  }
}
```

#### **Request 2: Test Failed Payment**
```
Same as above but change:
"status": "failed"
```

#### **Request 3: Test Invalid Data**
```
{
  "event": "payment_link.paid",
  "payload": {
    "payment_link": {
      "entity": {
        "customer": {
          "name": "Test"
        }
      }
    }
  }
}
```

## 🚀 **Testing Steps:**

### **Step 1: Send Request**
1. **Click "Send"**
2. **Check response status**
3. **Check response body**

### **Step 2: Check n8n**
1. **Go to n8n dashboard**
2. **Click "Executions"**
3. **Look for new execution**
4. **Click to see details**

### **Step 3: Verify Results**
- ✅ **Success**: 200 OK response
- ✅ **Execution**: New execution in n8n
- ✅ **Data**: Check if Google Sheets updated
- ✅ **Email**: Check if email was sent

## 📊 **Expected Responses:**

### **✅ Successful Response:**
```
Status: 200 OK
Body: {"success": true, "uuid": "1709123456789"}
```

### **❌ Error Response:**
```
Status: 400 Bad Request
Body: {"error": "Invalid webhook source"}
```

## 🔍 **Debug Tips:**

### **If Request Fails:**
1. **Check URL**: Correct n8n URL?
2. **Check Headers**: Content-Type set?
3. **Check Body**: Valid JSON?
4. **Check n8n**: Server running?

### **If n8n Execution Fails:**
1. **Check n8n code**: Razorpay-only code installed?
2. **Check data structure**: Matches expected format?
3. **Check logs**: Error messages in execution?

## 🎯 **Success Indicators:**

### **✅ Everything Working:**
- Postman shows 200 OK
- n8n shows successful execution
- Google Sheets has new row
- Email was sent

### **❌ Issues Found:**
- Postman error → Network/configuration issue
- n8n execution error → Code issue
- No data saved → Logic issue

## 🚀 **Next Steps After Testing:**

### **If Tests Pass:**
1. **Configure Razorpay webhook** with same URL
2. **Test real payment**
3. **Deploy to production**

### **If Tests Fail:**
1. **Fix n8n code**
2. **Check webhook configuration**
3. **Debug network issues**

---

**Use Postman to test the webhook thoroughly before configuring Razorpay!** 🔧✨
