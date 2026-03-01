# 🔧 **n8n Payment Status API Setup**

## 📋 **Create New n8n Workflow for Payment Status Check**

### **Workflow Name:** `Payment Status API`

### **Trigger Node: Webhook**
```
Method: GET
Path: api/payment-status/:paymentId
Authentication: None
```

### **Code Node: Check Payment Status**
```javascript
// Get payment ID from URL parameter
const paymentId = $json.params.paymentId;

if (!paymentId) {
  throw new Error("Payment ID is required");
}

// Check Google Sheets for payment ID
// You'll need to connect to Google Sheets here
// For now, return mock response

const mockPayments = {
  "pay_SLc8cGyssBLrs2": {
    success: true,
    uuid: "1709123456789",
    status: "captured",
    message: "Payment processed successfully"
  },
  "pay_failed_123": {
    success: false,
    error: "Payment failed - insufficient funds",
    status: "failed"
  }
};

const paymentData = mockPayments[paymentId];

if (paymentData) {
  return [{
    json: paymentData
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

### **Response Node: HTTP Response**
```
Status Code: 200
Headers: Content-Type: application/json
Body: {{$json}}
```

## 🚀 **Test the API**

### **Test URL:**
```
https://n8nnserver.duckdns.org/api/payment-status/pay_SLc8cGyssBLrs2
```

### **Expected Response:**
```json
{
  "success": true,
  "uuid": "1709123456789",
  "status": "captured",
  "message": "Payment processed successfully"
}
```

## 🔧 **Real Implementation with Google Sheets**

### **Connect to Google Sheets:**
1. **Add Google Sheets node**
2. **Select your spreadsheet**
3. **Filter by payment ID**
4. **Return payment status**

### **Code with Google Sheets:**
```javascript
const paymentId = $json.params.paymentId;

// Query Google Sheets for payment ID
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

## 🎯 **Frontend Integration**

### **Frontend will call:**
```javascript
const response = await fetch(`https://n8nnserver.duckdns.org/api/payment-status/${paymentId}`);
const status = await response.json();

if (status.success) {
  showSuccessOnPage(status.uuid);
} else {
  showPaymentError(status.error);
}
```

## 📊 **Error Handling**

### **Common Errors:**
- Payment not found
- Network timeout
- Server error
- Invalid payment ID

### **Frontend Error Display:**
```javascript
showPaymentError(status.error || 'Payment verification failed');
```

---

**Create this n8n workflow to enable payment status checking from the frontend!** 🔧✨
