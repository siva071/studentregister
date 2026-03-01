# 🔗 N8N Integration Guide

## 📡 Webhook Configuration

Your student registration system is now configured to send data to your n8n server at:

```
https://n8nnserver.duckdns.org/webhook/register
```

## 🔄 Data Flow

```
Registration Form → Razorpay Payment → Payment Success → 
POST to n8n Webhook → Your n8n Workflow Processes Data
```

## 📊 Data Structure Sent to n8n

### After Payment Success
```json
{
  "name": "Student Name",
  "email": "student@example.com", 
  "phone": "9876543210",
  "dob": "2000-01-01",
  "paymentId": "razorpay_payment_id"
}
```

### Direct Registration (Testing)
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "9876543210", 
  "dob": "2000-01-01"
}
```

## ⚙️ N8N Workflow Setup

### 1. Create Webhook Trigger
- **Method**: POST
- **Path**: `/webhook/register`
- **Authentication**: None (for now)

### 2. Add Code Node (UID Generation)
```javascript
// STEP 1 — UID Automatic Generate Cheyyadam (Numbers Only)
const body = $json.body || $json;
const now = new Date().toISOString();

// Generate numeric unique ID (example: 202602281234)
const uniqueId = Date.now().toString(); 

if (!body.name || !body.email || !body.dob) {
  throw new Error('Missing required fields: name, email, dob');
}

return [{
  json: {
    uuid: uniqueId,
    name: body.name,
    email: body.email,
    phone: body.phone || '',
    paymentId: body.paymentId || '',
    registeredAt: now,
    dob: body.dob,
    testStatus: 'registered'
  }
}];
```

### 3. Add Google Sheets Node
- **Operation**: Append
- **Sheet ID**: Your Google Sheet ID
- **Range**: Sheet1!A:H
- **Columns**: UUID, Name, Email, Phone, Payment ID, Registered At, DOB, Test Status

### 4. Add Gmail Node
- **To**: {{$json.email}}
- **Subject**: 🎉 RRB NTPC Mock Test Registration Successful - Job Alerts Telugu
- **Body**: Use the HTML template from emailService.js

## 🔧 Testing the Integration

### Method 1: Full Payment Flow
1. Fill the registration form
2. Complete Razorpay payment
3. Data automatically sent to n8n webhook

### Method 2: Direct Registration (Testing)
```javascript
// Open browser console and run:
fetch('https://n8nnserver.duckdns.org/webhook/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    dob: '2000-01-01'
  })
});
```

## 🔒 Security Considerations

### For Production:
1. **Add Webhook Authentication**:
   - Set up API key in n8n
   - Add header validation in frontend

2. **CORS Configuration**:
   ```javascript
   // In your n8n server or proxy
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```

3. **Rate Limiting**:
   - Implement rate limiting on webhook endpoint
   - Prevent spam registrations

## 🚀 Production Deployment

### Environment Variables
```env
N8N_WEBHOOK_URL=https://n8nnserver.duckdns.org/webhook/register
```

### Error Handling
The frontend includes comprehensive error handling:
- Network errors
- Invalid responses
- Payment failures
- Form validation errors

## 📈 Monitoring

### Check n8n Execution History:
1. Go to your n8n dashboard
2. Check workflow executions
3. Verify data flow through each node
4. Monitor error logs

### Expected Data Points:
- **UID Generation**: Numeric timestamp
- **Registration Data**: Complete student information
- **Payment ID**: Razorpay transaction ID
- **Timestamp**: ISO format registration time

## 🎯 Success Criteria

✅ **Webhook receives data immediately after payment**
✅ **UID is automatically generated in n8n**
✅ **Data is stored in Google Sheets**
✅ **Welcome email is sent to student**
✅ **Frontend shows success modal with UID**

---

**Your system is now fully integrated with n8n!** 🎉
