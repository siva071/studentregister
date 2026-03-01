# 🔧 **Duplicate Registration Prevention**

## 🎯 **Problem:**
- Same email/phone can register multiple times
- Need to prevent duplicate registrations

## ✅ **Solution: Check Before Registration**

### **Frontend Validation:**
```javascript
// Add to script.js
async function checkDuplicateRegistration(email, phone) {
    try {
        console.log('🔍 Checking for duplicate registration...');
        
        const response = await fetch('https://n8nnserver.duckdns.org/api/check-duplicate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                phone: phone
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.exists; // true if duplicate found
        } else {
            console.log('❌ Duplicate check failed');
            return false;
        }
    } catch (error) {
        console.log('❌ Error checking duplicate:', error.message);
        return false;
    }
}

// Add to form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    // Check for duplicates first
    const isDuplicate = await checkDuplicateRegistration(formData.email, formData.phone);
    
    if (isDuplicate) {
        showError('This email or phone number is already registered. Please use different details or contact support.');
        return;
    }
    
    // Continue with payment process...
});
```

### **n8n Duplicate Check API:**
```javascript
// Create new n8n workflow: /api/check-duplicate
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
                registeredAt: existingRecord.registeredAt
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

### **Error Display Function:**
```javascript
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <div class="text-red-600 text-xl mr-3">⚠️</div>
            <div>
                <h4 class="text-red-800 font-semibold">Registration Error</h4>
                <p class="text-red-600 text-sm">${message}</p>
            </div>
        </div>
    `;
    
    // Insert error message before form
    const form = document.getElementById('registrationForm');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Remove error after 10 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 10000);
}
```

## 🎯 **Alternative: n8n-Level Prevention**

### **Check in Main Webhook:**
```javascript
// In main n8n webhook (before saving)
const email = paymentLink.customer?.email || "";
const phone = paymentLink.customer?.contact || "";

// Check Google Sheets for duplicates
const existingRecord = sheetData.find(row => 
    row.email === email || row.phone === phone
);

if (existingRecord) {
    return [{
        json: {
            error: "Duplicate registration",
            message: "Email or phone already registered",
            existingUid: existingRecord.uuid
        }
    }];
}

// Continue with registration if no duplicate...
```

## 📊 **Implementation Steps:**

### **Step 1: Add Frontend Check**
- Add duplicate check function
- Add error display
- Check before payment

### **Step 2: Create n8n API**
- Create duplicate check workflow
- Connect to Google Sheets
- Return existence status

### **Step 3: Add Backend Check**
- Check in main webhook
- Prevent saving duplicates
- Return error if found

## 🎯 **User Experience:**

### **✅ Good Flow:**
1. User fills form
2. System checks for duplicates
3. If no duplicate → proceed to payment
4. If duplicate → show error message

### **❌ Duplicate Handling:**
- Clear error message
- Show what's already registered
- Option to contact support
- Prevent duplicate payment
