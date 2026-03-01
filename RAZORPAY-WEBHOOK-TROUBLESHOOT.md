# 🔧 **Razorpay Webhook Not Working - Complete Troubleshooting**

## 🚨 **Common Issues & Solutions:**

### **1️⃣ Webhook URL Configuration**

#### **❌ Check These:**
- Webhook URL: `https://n8nnserver.duckdns.org/webhook/register`
- Is n8n server running?
- Is URL accessible from internet?

#### **✅ Test Webhook URL:**
```bash
curl -X POST https://n8nnserver.duckdns.org/webhook/register \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **2️⃣ Razorpay Webhook Setup**

#### **❌ Common Mistakes:**
- Test mode vs Live mode mismatch
- Wrong events selected
- Secret not matching
- Webhook not saved properly

#### **✅ Correct Setup:**
1. **Razorpay Dashboard** → Account & Settings → Webhooks
2. **Webhook URL**: `https://n8nnserver.duckdns.org/webhook/register`
3. **Secret**: `S8dj29Kd9@mockTest#2026!Rzp` (or your secret)
4. **Events**: Only `payment_link.paid`
5. **Save webhook**

### **3️⃣ Mode Mismatch Issue**

#### **❌ Problem:**
- Test mode payment → Test webhook needed
- Live mode payment → Live webhook needed

#### **✅ Solution:**
```
If using Test Mode:
- Enable Test Mode in Razorpay Dashboard
- Use Test webhook URL
- Use Test payment link

If using Live Mode:
- Enable Live Mode in Razorpay Dashboard
- Use Live webhook URL
- Use Live payment link
```

### **4️⃣ Payment Link vs Checkout API**

#### **❌ Issue:**
Payment Link webhook structure different from Checkout API webhook.

#### **✅ Payment Link Webhook Structure:**
```json
{
  "event": "payment_link.paid",
  "payload": {
    "payment_link": {
      "entity": {
        "customer": {
          "name": "Customer Name",
          "email": "customer@example.com",
          "contact": "+919876543210"
        }
      }
    },
    "payment": {
      "entity": {
        "id": "pay_SLc8cGyssBLrs2",
        "status": "captured"
      }
    }
  }
}
```

### **5️⃣ n8n Webhook Node Configuration**

#### **❌ Check These:**
- HTTP Method: `POST`
- Path: `register`
- Authentication: `None`
- "Respond immediately": ✅ Enabled

#### **✅ Test n8n Webhook:**
1. Go to n8n Webhook node
2. Click "Test webhook"
3. Send test data
4. Should see execution in n8n

### **6️⃣ Debug Steps**

#### **Step 1: Check n8n Executions**
```
1. Go to n8n → Executions
2. Look for recent webhook executions
3. Check if any executions exist
4. If none, webhook not reaching n8n
```

#### **Step 2: Check Razorpay Webhook Logs**
```
1. Razorpay Dashboard → Webhooks
2. Click on your webhook
3. Check "Recent Deliveries"
4. Look for failed deliveries
5. Check error messages
```

#### **Step 3: Test with Manual Webhook**
```bash
curl -X POST https://n8nnserver.duckdns.org/webhook/register \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test" \
  -d '{
    "event": "payment_link.paid",
    "payload": {
      "payment_link": {
        "entity": {
          "customer": {
            "name": "Test User",
            "email": "test@example.com",
            "contact": "+919876543210"
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

### **7️⃣ Common Solutions**

#### **Solution A: Mode Fix**
```
1. Check Razorpay dashboard mode (Test/Live)
2. Ensure webhook mode matches
3. Use correct payment link for that mode
```

#### **Solution B: URL Fix**
```
1. Verify n8n server is running
2. Test webhook URL accessibility
3. Check firewall/network issues
```

#### **Solution C: Event Fix**
```
1. Ensure only `payment_link.paid` selected
2. Remove other events
3. Save webhook again
```

#### **Solution D: Secret Fix**
```
1. Note webhook secret from Razorpay
2. Update n8n code with same secret
3. Ensure exact match
```

## 🚀 **Quick Test Process:**

### **Step 1: Test Manual Webhook**
Run the curl command above
- If n8n receives it → Webhook URL works
- If n8n doesn't receive → URL/network issue

### **Step 2: Test Razorpay Payment**
1. Use test payment link
2. Complete payment with test card
3. Check Razorpay dashboard for webhook delivery
4. Check n8n executions

### **Step 3: Debug n8n Code**
1. Add console.log in n8n code
2. Check execution logs
3. Verify data structure

## 🔍 **What to Check First:**

1. **Is n8n server running?**
2. **Is webhook URL accessible?**
3. **Are you in Test mode or Live mode?**
4. **Did you select correct event?**
5. **Did you save webhook properly?**

---

**Follow these steps systematically to identify and fix the webhook issue!** 🔧✨
