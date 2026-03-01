// RRB NTPC Mock Test Registration - Version 29.0 - RAZORPAY WEBHOOK ONLY - FIXED
console.log('🚀🚀🚀 SCRIPT V29.0 LOADED - RAZORPAY WEBHOOK ONLY - NO FRONTEND POST');

document.addEventListener('DOMContentLoaded', function() {
    // Add visual indicator that new version is loaded
    document.body.style.borderTop = '5px solid #ff0000';
    setTimeout(() => {
        document.body.style.borderTop = 'none';
    }, 3000);
    
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let isSubmitting = false;

    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const dob = document.getElementById('dob').value.trim();
        const terms = document.getElementById('terms').checked;

        // Reset previous errors
        document.querySelectorAll('.error').forEach(el => el.remove());

        let isValid = true;

        // Name validation
        if (name.length < 3) {
            showError('name', 'Name must be at least 3 characters');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            showError('phone', 'Please enter a valid 10-digit mobile number');
            isValid = false;
        }

        // DOB validation
        const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dobRegex.test(dob)) {
            showError('dob', 'Please enter date in DD/MM/YYYY format');
            isValid = false;
        }

        // Terms validation
        if (!terms) {
            showError('terms', 'You must agree to the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const error = document.createElement('div');
        error.className = 'error text-red-500 text-sm mt-1';
        error.textContent = message;
        field.parentNode.appendChild(error);
    }

    // Get form data
    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            dob: document.getElementById('dob').value.trim()
        };
    }

    // Check for duplicate registration
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

    // Show error message
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

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('⚠️ Form already submitting...');
            return;
        }

        if (!validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }

        isSubmitting = true;
        
        const formData = getFormData();
        
        // Check for duplicates first
        const isDuplicate = await checkDuplicateRegistration(formData.email, formData.phone);
        
        if (isDuplicate) {
            showError('This email or phone number is already registered. Please use different details or contact support.');
            isSubmitting = false;
            return;
        }
        
        // Generate UID and store it
        const uid = Date.now().toString();
        localStorage.setItem('registration_uid', uid);
        localStorage.setItem('registration_data', JSON.stringify(formData));
        
        console.log('🔢 Generated UID:', uid);
        console.log('📋 Form data:', formData);
        
        // Show loading state
        submitBtn.disabled = true;
        loadingSpinner.classList.add('show');
        
        try {
            // Create Razorpay payment link with customer data and UID
            console.log('🔗 Creating Razorpay payment link with customer data and UID...');
            
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    amount: 1900, 
                    currency: 'INR', 
                    receipt: 'receipt_' + uid,
                    notes: {
                        ...formData,
                        uid: uid  // Include UID in Razorpay notes
                    }
                })
            });
            
            const orderData = await response.json();
            
            if (orderData.error) {
                alert(orderData.error);
                submitBtn.disabled = false;
                loadingSpinner.classList.remove('show');
                isSubmitting = false;
                return;
            }
            
            console.log('✅ Payment link created:', orderData);
            
            // Redirect to Razorpay payment link
            window.location.href = orderData.short_url;
            
        } catch (error) {
            console.error('Payment initiation error:', error);
            alert('Failed to initiate payment. Please try again.');
            submitBtn.disabled = false;
            loadingSpinner.classList.remove('show');
            isSubmitting = false;
        }
    });

    // Check payment status from n8n
    async function checkPaymentStatus(paymentId) {
        try {
            console.log('🔍 Checking payment status for:', paymentId);
            
            const response = await fetch(`https://n8nnserver.duckdns.org/api/payment-status/${paymentId}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Payment status:', data);
                return data;
            } else {
                console.log('❌ Payment status check failed');
                return null;
            }
        } catch (error) {
            console.log('❌ Error checking payment status:', error.message);
            return null;
        }
    }

    // Show payment success on page
    function showSuccessOnPage(uid) {
        // Hide processing section and show success section
        document.getElementById('paymentProcessingSection').classList.add('hidden');
        document.getElementById('successSection').classList.remove('hidden');
        
        // Set the UID
        document.getElementById('pageUID').textContent = uid;
        
        console.log('✅ Success shown on page with UID:', uid);
    }

    // Show payment error on page
    function showPaymentError(message) {
        // Hide processing section and show error
        document.getElementById('paymentProcessingSection').classList.add('hidden');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-6 text-center';
        errorDiv.innerHTML = `
            <div class="text-red-600 text-4xl mb-4">❌</div>
            <h3 class="text-xl font-bold text-red-800 mb-2">Payment Processing Failed</h3>
            <p class="text-red-600 mb-4">${message}</p>
            <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                Try Again
            </button>
        `;
        
        // Replace form with error message
        document.getElementById('registrationForm').innerHTML = '';
        document.getElementById('registrationForm').appendChild(errorDiv);
        
        console.log('❌ Payment error shown:', message);
    }

    // Monitor payment status after redirect
    async function monitorPaymentStatus(paymentId, maxAttempts = 10) {
        let attempts = 0;
        
        const checkStatus = async () => {
            attempts++;
            console.log(`🔍 Checking payment status (attempt ${attempts}/${maxAttempts})`);
            
            try {
                const status = await checkPaymentStatus(paymentId);
                
                if (status && status.success) {
                    // Payment processed successfully
                    showSuccessOnPage(status.uuid);
                    return true;
                } else if (status && status.error) {
                    // Payment failed
                    showPaymentError(status.error);
                    return true;
                }
            } catch (error) {
                console.log('Status check error:', error.message);
            }
            
            if (attempts < maxAttempts) {
                // Check again after 3 seconds
                setTimeout(checkStatus, 3000);
            } else {
                // Max attempts reached
                showPaymentError('Payment verification timed out. Please check your email for login details.');
            }
        };
        
        // Start checking after 5 seconds
        setTimeout(checkStatus, 5000);
    }

    // Close modal
    function closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    // Test UID synchronization
    function testUidSync() {
        console.log('🔧 Testing UID synchronization...');
        
        const testUid = Date.now().toString();
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            dob: '01/01/2000',
            paymentId: 'test_payment_' + testUid,
            uid: testUid
        };
        
        console.log('📤 Sending test data:', testData);
        
        fetch('https://n8nnserver.duckdns.org/webhook/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        })
        .then(response => response.json())
        .then(result => {
            console.log('📥 Test response:', result);
            
            if (result[0] && result[0].json && result[0].json.uuid === testUid) {
                console.log('✅ UID synchronization WORKING! Same UID returned:', result[0].json.uuid);
                alert('✅ UID synchronization is working! UID: ' + result[0].json.uuid);
            } else {
                console.log('❌ UID synchronization FAILED! Expected:', testUid, 'Got:', result[0]?.json?.uuid);
                alert('❌ UID synchronization failed! Check n8n code.');
            }
        })
        .catch(error => {
            console.error('❌ Test error:', error);
            alert('❌ Test failed: ' + error.message);
        });
    }

    // Check if we need to show payment processing
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id');
    
    if (paymentId) {
        console.log('🔄 Payment detected, monitoring status...');
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('paymentProcessingSection').classList.remove('hidden');
        monitorPaymentStatus(paymentId);
    }

    // Add test button (remove in production)
    /*
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test Registration (No Payment)';
    testBtn.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50';
    testBtn.onclick = testUidSync;
    document.body.appendChild(testBtn);
    */
});
